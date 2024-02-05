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
    )
    AND a.id = $2;