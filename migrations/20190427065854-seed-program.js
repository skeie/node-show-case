// this file has been modified to be used as an example
'use strict';
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const P1 = path.resolve(
  __dirname,
  '../src/app/programs/data/WORKOUTS_PHASE_1.csv'
);

function parseCsv(inputFilePath) {
  return new Promise((resolve, reject) => {
    let data = [];
    fs.createReadStream(inputFilePath)
      .pipe(csv())
      .on('data', function(row) {
        try {
          if (row.name) {
            data.push(row);
          }
        } catch (err) {
          reject(err);
        }
      })
      .on('end', function() {
        resolve(data);
      });
  });
}

var dbm;
var type;
var seed;

async function insertPhase(db, phaseName, phasePosition, introVideo) {
  const videoResult = await db.runSql(
    `INSERT INTO videos (male_video_uri, name) VALUES ('${introVideo}', '${phaseName} - intro-video') RETURNING id`
  );

  const videoId = videoResult.rows[0].id;

  const presult = await db.runSql(
    `INSERT INTO phases (program_id, name, position, intro_video_id) VALUES (1, '${phaseName}', ${phasePosition}, ${videoId}) RETURNING id`
  );
  const phaseId = presult.rows[0].id;
  return phaseId;
}

async function insertWorkout(db, csvFile, phaseId, workoutPosition) {
  const workoutExercises = await parseCsv(csvFile);

  const workoutRes = await db.runSql(
    `INSERT INTO workouts (phase_id, position) VALUES (${phaseId}, ${workoutPosition}) RETURNING id`
  );
  const workoutId = workoutRes.rows[0].id;

  await Promise.all(
    workoutExercises.map(async (row, i) => {
      const { name, sets, reps } = row;
      return await db.runSql(
        `INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, position) VALUES (${workoutId}, (SELECT id FROM exercises WHERE name='${name}'), '${sets}', '${reps}', ${i +
          1})`
      );
    })
  );
}

async function insertWorkoutWithSuperset(
  db,
  csvFile,
  phaseId,
  workoutPosition
) {
  const workoutExercises = await parseCsv(csvFile);

  const workoutRes = await db.runSql(
    `INSERT INTO workouts (phase_id, position) VALUES (${phaseId}, ${workoutPosition}) RETURNING id`
  );
  const workoutId = workoutRes.rows[0].id;

  await Promise.all(
    workoutExercises.map(async (row, i) => {
      const { name, sets, reps, supersetid } = row;

      const position = i + 1;
      const SQL = supersetid
        ? `INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, position, super_set_id) VALUES (${workoutId}, (SELECT id FROM exercises WHERE name='${name}'), '${sets}', '${reps}', ${position}, ${supersetid})`
        : `INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, position) VALUES (${workoutId}, (SELECT id FROM exercises WHERE name='${name}'), '${sets}', '${reps}', ${position})`;

      return await db.runSql(SQL);
    })
  );
}

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function(db) {
  const prePhaseId = await insertPhase(
    db,
    'Pre-phase',
    1,
    'https://some-file.mp4'
  );

  await insertWorkout(db, P1, prePhaseId, 1);
};

exports.down = async function(db) {
  await db.runSql('DELETE FROM videos');
  await db.runSql('DELETE FROM workout_exercises');
  await db.runSql('DELETE FROM workouts');
  await db.runSql('DELETE FROM phases');
  return null;
};

exports._meta = {
  version: 1,
};
