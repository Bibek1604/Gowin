-- Enables Supabase Realtime (Postgres change notifications over websocket)
-- for the tables the public site needs to reflect live, without a manual
-- page reload, whenever an admin adds/edits/deletes something.
ALTER PUBLICATION supabase_realtime ADD TABLE tour_packages;
ALTER PUBLICATION supabase_realtime ADD TABLE categories;
