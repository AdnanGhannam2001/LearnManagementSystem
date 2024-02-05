SELECT
    1
FROM
    public."User" u
WHERE
    u.id = $1
    AND u."permission" = 'Coach';