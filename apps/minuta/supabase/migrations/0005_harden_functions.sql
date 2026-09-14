-- Solo el propio usuario (vía minuta_bootstrap_me) o el backend pueden instalar una pauta.
revoke all on function minuta_bootstrap_user(uuid) from public, anon, authenticated;
grant execute on function minuta_bootstrap_user(uuid) to service_role;

revoke all on function minuta_on_auth_user_created() from public, anon, authenticated;

revoke all on function minuta_bootstrap_me() from public, anon;
grant execute on function minuta_bootstrap_me() to authenticated;
