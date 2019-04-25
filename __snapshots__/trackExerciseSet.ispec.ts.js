exports['trackExerciseSetMutation should create new set from given exercise log 1'] = {
  "trackExerciseSet": {
    "exercises": [
      {
        "sets": [
          {
            "reps": 10,
            "weight": 240,
            "position": 1
          },
          {
            "reps": 5,
            "weight": 999,
            "position": 2
          }
        ]
      }
    ]
  }
}

exports['trackExerciseSetMutation should update given set 1'] = {
  "trackExerciseSet": {
    "exercises": [
      {
        "sets": [
          {
            "reps": 9,
            "weight": 50,
            "position": 1
          }
        ]
      }
    ]
  }
}
