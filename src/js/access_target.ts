const accessTargets = {
  dev: {
    medas: {
      url: 'http://localhost:3110/v1/graphql',
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoxLCJ1aWQiOiIzMTZiN2Y0Yi1iYjI0LTQ2MTUtYWYzNS1mNTIwM2JkYTU1YjMiLCJ0b2tlbiI6IjhmMjBhZjEzLWY3MjktNGZlZC1hNWIyLWQ3NmZjNTQ3M2JlYiIsImlhdCI6MTY4ODY1Nzc0Mn0.Qz04mOSvJOU256U9UFbj96qvZFFjZPTUsSnegaCbRns',
    },
    remoteUids: [
      '9b1e8ca3-a9e9-4a23-a993-32fc7ba0c2bc',
      '56e25970-a23c-437f-8f49-d4af91bfc0f7',
      'bb9ae20c-562b-4ade-b51f-cfa7ae667e08',
      '4ec14a83-e52a-4657-b644-276ef21d2a80',
    ]
  },
  stg: {
    medas: {
      url: 'http://localhost:3110/v1/graphql',
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoxLCJ1aWQiOiIzMTZiN2Y0Yi1iYjI0LTQ2MTUtYWYzNS1mNTIwM2JkYTU1YjMiLCJ0b2tlbiI6IjhmMjBhZjEzLWY3MjktNGZlZC1hNWIyLWQ3NmZjNTQ3M2JlYiIsImlhdCI6MTY4ODY1Nzc0Mn0.Qz04mOSvJOU256U9UFbj96qvZFFjZPTUsSnegaCbRns',
    },
    remoteUids: [
      '9b1e8ca3-a9e9-4a23-a993-32fc7ba0c2bc',
      '56e25970-a23c-437f-8f49-d4af91bfc0f7',
      'bb9ae20c-562b-4ade-b51f-cfa7ae667e08',
      '4ec14a83-e52a-4657-b644-276ef21d2a80',
    ]
  },
  prod: {
    medas: {
      url: 'https://api.norumes.cloud/v1/graphql',
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoxLCJ1aWQiOiJlNmVjODIyOS03ODFlLTRhYjMtODRkNS1kNmI3OTViZTEzNzUiLCJ0b2tlbiI6ImFjNGM1YzA3LTZjM2MtNGE1MC05YTVmLTkzNTUwOWE4YTlhMyIsImlhdCI6MTY4ODkxODQxOH0.Oc1AUVVIN3EUsad5Ii8yl34eYNBsujoHa7KxR3EMmkU',
    },
    remoteUids: [
      '9b1e8ca3-a9e9-4a23-a993-32fc7ba0c2bc',
      '56e25970-a23c-437f-8f49-d4af91bfc0f7',
      'bb9ae20c-562b-4ade-b51f-cfa7ae667e08',
      '4ec14a83-e52a-4657-b644-276ef21d2a80',
    ]
  }
}

export const accessTarget = accessTargets['prod']
