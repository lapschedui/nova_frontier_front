const API_URL = 'http://127.0.0.1:8000'

export async function getWorkoutDataForChart(chapter) {
  const res = await fetch(`${API_URL}/workout/${chapter}/get`)
  return await res.json()
}