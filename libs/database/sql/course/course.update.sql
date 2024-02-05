SELECT
    1
FROM
    public."Course" c
WHERE
    (
        c.id IN (
            SELECT
                co."courseId"
            FROM
                public."Coach" co
            WHERE
                co."userId" = $1
        )
    )
    AND c.id = $2;