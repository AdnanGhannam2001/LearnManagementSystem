SELECT
    1
FROM
    public."Comment" c
WHERE
    c.id = $2
    AND (
        c."userId" = $1
        OR
        EXISTS (
            SELECT 1
            FROM
                public."Lesson" l
            WHERE
                l.id = c."lessonId"
                AND (
                    l."unitId" IN (
                        SELECT
                            u.id
                        FROM
                            public."Unit" u
                        WHERE
                            u."courseId" IN (
                                SELECT
                                    coa."courseId"
                                FROM
                                    public."Coach" coa
                                WHERE
                                    coa."userId" = $1
                            )
                    )
                )
        )
        OR
        EXISTS (
            SELECT 1
            FROM
                public."Question" q
            WHERE
                q.id = c."questionId"
                AND (
                    q."forumId" IN (
                        SELECT
                            f.id
                        FROM
                            public."Forum" f
                        WHERE
                            f."courseId" IN (
                                SELECT
                                    coa."courseId"
                                FROM
                                    public."Coach" coa
                                WHERE
                                    coa."userId" = $1
                            )
                    )
                )
        )
        OR
        EXISTS (
            SELECT 1
            FROM public."User" u
            WHERE
                u.id = $1
                AND u."permission" IN ('Moderator', 'Admin')
        )
    );