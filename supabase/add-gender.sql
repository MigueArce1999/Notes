-- For an existing installation only; fresh installations use schema.sql.
alter table public.fragrance_profiles add column if not exists gender text check(gender in ('Hombre','Mujer'));
create or replace function public.save_note_profile(payload jsonb) returns uuid language plpgsql security invoker set search_path=public as $$
declare cid uuid; pid uuid; p jsonb:=payload->'profile'; r jsonb:=payload->'recommendations';
begin
if payload->>'consent' is distinct from 'true' then raise exception 'Consent required'; end if;
if p->>'gender' is null or p->>'gender' not in ('Hombre','Mujer') then raise exception 'Gender selection required'; end if;
insert into customers(name,phone,email) values(payload->>'name',payload->>'phone',nullif(payload->>'email','')) returning id into cid;
insert into fragrance_profiles(customer_id,gender,desired_feelings,usage_context,time_of_day,preferred_intensity,preferred_profiles) values(cid,p->>'gender',p->'desired_feelings',p->>'usage_context',p->>'time_of_day',(p->>'preferred_intensity')::integer,p->'preferred_profiles') returning id into pid;
insert into recommendations(customer_id,profile_id,recommended_fragrance_id,recommended_name,match_score,second_option_id,third_option_id) values(cid,pid,r->0->>'id',r->0->>'name',(r->0->>'score')::integer,r->1->>'id',r->2->>'id');
return pid;
end; $$;
revoke all on function public.save_note_profile(jsonb) from public,anon,authenticated;
grant execute on function public.save_note_profile(jsonb) to service_role;
