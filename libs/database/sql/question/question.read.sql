SELECT
    1
FROM
    public."Question" q
WHERE
    (
        q."forumId" IN (
            SELECT
                f.id
            FROM
                public."Forum" f
            WHERE
                f."courseId" IN (
                    SELECT
                        ue."courseId"
                    FROM
                        public."Rolled" ue
                    WHERE
                        ue."userId" = $1
                )
                OR f."courseId" IN (
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
    )
    AND q.id = $2;