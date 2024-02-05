SELECT
    1
FROM
    public."Rolled" ue
WHERE
    ue."userId" = $1
    AND ue."courseId" = $2;