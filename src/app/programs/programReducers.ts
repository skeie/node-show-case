import mapKeys from 'lodash/mapKeys';
import camelcase from 'camelcase';

export const reduceProgram = programData => {
  const program = programData.reduce(
    (program, row) => {
      const {
        p_id,
        p_name,
        p_logo_uri,
        intro_vid_male_video_uri,
        intro_vid_male_thumbnail_uri,
        intro_vid_female_video_uri,
        intro_vid_female_thumbnail_uri,
        e_id,
        e_name,
        v_id,
        v_male_video_uri,
        v_male_thumbnail_uri,
        v_female_video_uri,
        v_female_thumbnail_uri,
        ph_id,
        ph_program_id,
        ph_rest_time,
        ph_name,
        ph_position,
        w_id,
        w_phase_id,
        w_position,
        w_video_id,
        we_id,
        we_exercise_id,
        we_workout_id,
        we_super_set_id,
        we_sets,
        we_reps,
        we_position,
      } = row;

      if (p_id) {
        program.id = p_id;
        program.name = p_name;
        program.logoUri = p_logo_uri;
      }

      // create phase
      if (ph_id && !program.phases[ph_id]) {
        program.phases[ph_id] = {
          name: ph_name,
          id: ph_id,
          position: ph_position,
          workouts: {},
        };
      }

      // intro video
      if (intro_vid_male_video_uri) {
        program.phases[ph_id] = {
          ...program.phases[ph_id],
          introVideo: {
            maleVideoUri: intro_vid_male_video_uri,
            maleVideoThumbnailUri: intro_vid_male_thumbnail_uri,
            femaleVideoUri: intro_vid_female_video_uri,
            femaleVideoThhumbnailUri: intro_vid_female_thumbnail_uri,
          },
        };
      }

      // // create workout
      if (w_id && !program.phases[ph_id].workouts[w_id]) {
        program.phases[ph_id].workouts[w_id] = {
          position: w_position,
          id: w_id,
          phaseId: w_phase_id,
          videoId: w_video_id,
          workoutExercises: {},
        };
      }

      // // create workout exercise
      if (
        we_exercise_id &&
        program.phases[ph_id] &&
        !program.phases[ph_id].workouts[w_id].workoutExercises[we_exercise_id]
      ) {
        const workoutExercise = {
          id: we_id,
          superSetId: we_super_set_id,
          sets: we_sets,
          reps: we_reps,
          position: we_position,
          restTime: ph_rest_time,
          exercise: {
            id: e_id,
            name: e_name,
            video: null,
          },
        };

        // add video
        if (v_male_video_uri || v_female_thumbnail_uri) {
          workoutExercise.exercise.video = {
            id: v_id,
            maleVideoUri: v_male_video_uri,
            maleThumbnailUri: v_male_thumbnail_uri,
            femaleVideoUri: v_female_video_uri,
            femaleThumbnailUri: v_female_thumbnail_uri,
          };
        }

        program.phases[ph_id].workouts[w_id].workoutExercises[
          we_exercise_id
        ] = workoutExercise;
      }

      return program;
    },
    {
      phases: {},
    }
  );

  // flat map to sorted arrays
  program.phases = Object.keys(program.phases)
    .map(key => {
      const phase = program.phases[key];

      phase.workouts = Object.keys(phase.workouts)
        .map(wKey => {
          const workout = phase.workouts[wKey];

          workout.workoutExercises = Object.keys(workout.workoutExercises)
            .map(eKey => {
              return workout.workoutExercises[eKey];
            })
            .sort((a, b) => a.position - b.position);

          return workout;
        })
        .sort((a, b) => a.position - b.position);

      return phase;
    })
    .sort((a, b) => a.position - b.position);

  return program;
};

export const reduceVideos = videoRows => {
  return videoRows.map(reduceVideo);
};

export const reduceVideo = video => mapKeys(video, (_, k) => camelcase(k));
