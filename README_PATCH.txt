# Patch: remove contacts API + add runtime=nodejs

## Что сделано
- Удалить папку `app/api/contacts/` (она лишняя, используем только `app/api/contact/`).
- В `app/api/contact/route.ts` добавлен `export const runtime = "nodejs";`.

## Применение
1. Удали папку `app/api/contacts/` в проекте.
2. Замени файл `app/api/contact/route.ts` на версию из этого патча.
3. Закоммить и задеплой заново.
