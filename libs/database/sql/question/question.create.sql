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
        )
    )
    AND q.id = $2;