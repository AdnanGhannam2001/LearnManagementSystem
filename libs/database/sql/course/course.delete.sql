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
        OR
        EXISTS (
            SELECT 1
            FROM public."User" u
            WHERE
                u.id = $1
                AND u."permission" IN ('Moderator', 'Admin')
        )
    )
    AND c.id = $2;