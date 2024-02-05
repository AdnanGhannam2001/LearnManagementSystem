SELECT
    1
FROM
    public."Unit" u
WHERE
    (
        EXISTS (
            SELECT 1
            FROM public."User" usr
            WHERE usr.id = $1
                AND usr."permission" IN ('Moderator', 'Admin')
        )
        OR
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