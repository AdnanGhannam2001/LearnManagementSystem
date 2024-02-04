SELECT
    1
FROM
    public."Lesson" l
WHERE
    (
        l."unitId" IN (
            SELECT
                u.id
            FROM
                public."Unit" u
            WHERE
                u."courseId" IN (
                    SELECT
                        c."courseId"
                    FROM
                        public."Coach" c
                    WHERE
                        c."userId" = $1
                )
        )
    )
    AND l.id = $2;