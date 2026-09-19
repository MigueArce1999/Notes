import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
export const records=sqliteTable('admin_records',{
 id:text('id').primaryKey(),kind:text('kind').notNull(),payload:text('payload').notNull(),revision:integer('revision').notNull().default(1),archived:integer('archived').notNull().default(0),createdAt:text('created_at').notNull(),updatedAt:text('updated_at').notNull(),
},t=>[index('records_kind_archived').on(t.kind,t.archived)]);
