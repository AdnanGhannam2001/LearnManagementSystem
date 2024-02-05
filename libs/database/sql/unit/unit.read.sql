SELECT
    1
FROM
    public."Unit" u
WHERE
    (
        u."courseId" IN (
            SELECT
                ue."courseId"
            FROM
                public."Rolled" ue
            WHERE
                ue."userId" = $1
        )
        OR u."courseId" IN (
            SELECT
                c."courseId"
            FROM
                public."Coach" c
            WHERE
                c."userId" = $1
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
    AND u.id = $2;