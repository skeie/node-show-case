exports['startWorkout should create new workout log 1'] = {
  "startWorkout": {
    "phases": [
      {
        "position": 1,
        "isCurrent": true,
        "workouts": [
          {
            "position": 1,
            "isCurrent": true,
            "workoutLog": {
              "isCompleted": false
            }
          }
        ]
      },
      {
        "position": 2,
        "isCurrent": false,
        "workouts": [
          {
            "position": 1,
            "isCurrent": false,
            "workoutLog": null
          },
          {
            "position": 2,
            "isCurrent": false,
            "workoutLog": null
          }
        ]
      },
      {
        "position": 3,
        "isCurrent": false,
        "workouts": [
          {
            "position": 1,
            "isCurrent": false,
            "workoutLog": null
          },
          {
            "position": 2,
            "isCurrent": false,
            "workoutLog": null
          }
        ]
      },
      {
        "position": 4,
        "isCurrent": false,
        "workouts": [
          {
            "position": 1,
            "isCurrent": false,
            "workoutLog": null
          },
          {
            "position": 2,
            "isCurrent": false,
            "workoutLog": null
          },
          {
            "position": 3,
            "isCurrent": false,
            "workoutLog": null
          }
        ]
      }
    ]
  }
}
