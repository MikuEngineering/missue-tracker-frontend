export function delay (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function mockGetProjectIds () {
  await delay(300)
  return [1, 2, 3, 4, 5, 6, 7]
  // return []
}

export async function mockGetProjectInfo (projectId: number) {
  await delay(Math.floor(Math.random() * 1000 + 2000))
  return {
    name: `project-${projectId}`,
    createdDate: new Date().toJSON(),
    description: `A missue-tracker project-${projectId}.`,
    privacy: Math.floor(Math.random() * 2),
    tags: ['typescript', 'vue', 'scss']
  }
}
