SELECT
    1
FROM
    public."Unit" u
WHERE
    (
        u."courseId" IN (
            SELECT
                c."courseId"
            FROM
                public."Coach" c
            WHERE
                c."userId" = $1
        )
    )
    AND u.id = $2;