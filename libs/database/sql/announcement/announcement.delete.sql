SELECT
    1
FROM
    public."Announcement" a
WHERE
    (
        a."courseId" IN (
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
    AND a.id = $2;