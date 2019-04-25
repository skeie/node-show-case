export const GET_PROGRAM = `
      SELECT 
        p.id as p_id,
        p.name as p_name,
        p.logo_uri as p_logo_uri,

        intro_vid.male_video_uri AS intro_vid_male_video_uri,
        intro_vid.male_thumbnail_uri AS intro_vid_male_thumbnail_uri,
        intro_vid.female_video_uri AS intro_vid_female_video_uri,
        intro_vid.female_thumbnail_uri AS intro_vid_female_thumbnail_uri,

        e.id as e_id,
        e.name as e_name,

        v.id AS v_id,
        v.male_video_uri AS v_male_video_uri,
        v.male_thumbnail_uri AS v_male_thumbnail_uri,
        v.female_video_uri AS v_female_video_uri,
        v.female_thumbnail_uri AS v_female_thumbnail_uri,

        ph.id as ph_id,
        ph.program_id as ph_program_id,
        ph.name as ph_name,
        ph.position as ph_position,
        ph.rest_time as ph_rest_time,

        w.id as w_id,
        w.phase_id as w_phase_id,
        w.position as w_position,
        w.video_id as w_video_id,

        we.id as we_id,
        we.exercise_id as we_exercise_id,
        we.workout_id as we_workout_id,
        we.super_set_id as we_super_set_id,
        we.sets as we_sets,
        we.reps as we_reps,
        we.position as we_position
      
      FROM programs p
      LEFT JOIN phases AS ph ON ph.program_id = p.id
      LEFT JOIN videos AS intro_vid ON ph.intro_video_id = intro_vid.id
      LEFT JOIN workouts AS w ON w.phase_id = ph.id
      LEFT JOIN workout_exercises AS we ON we.workout_id=w.id
      LEFT JOIN exercises AS e ON e.id = we.exercise_id
      LEFT JOIN videos as v ON e.video_id = v.id
      WHERE p.id=$1
`;

export const GET_TRIGGER_SESSION_EXERCISES = `
SELECT 
e.id,
e.name,
te.position,
v.male_video_uri as "maleVideoUri",
v.id as "videoId",
v.female_video_uri as "femaleVideoUri",
v.female_thumbnail_uri as "femaleThumbnailUri",
v.male_thumbnail_uri as "maleThumbnailUri"
FROM trigger_sessions t
LEFT JOIN trigger_session_exercise AS te on te.trigger_session_id = t.id
LEFT JOIN exercises AS e ON e.id = te.exercise_id
LEFT JOIN videos v on v.id = e.video_id
WHERE t.id=$1
ORDER BY te.position;
`;
