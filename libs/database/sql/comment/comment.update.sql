SELECT
    1
FROM
    public."Comment" c
WHERE
    c.id = $2
    AND c."userId" = $1;