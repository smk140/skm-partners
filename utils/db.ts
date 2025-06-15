import { neon } from "@neondatabase/serverless"

let sql: any = null

export async function connectToDatabase() {
  if (!sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set")
    }

    sql = neon(process.env.DATABASE_URL)
    console.log("Database connection established")
  }

  return sql
}

// 데이터베이스 연결 테스트 함수
export async function testConnection() {
  try {
    const db = await connectToDatabase()
    await db`SELECT 1 as test`
    return true
  } catch (error) {
    console.error("Database connection test failed:", error)
    return false
  }
}

// 트랜잭션 실행 함수
export async function executeTransaction(queries: Array<() => Promise<any>>) {
  const db = await connectToDatabase()

  try {
    // Neon은 자동으로 트랜잭션을 처리하므로 순차적으로 실행
    const results = []
    for (const query of queries) {
      const result = await query()
      results.push(result)
    }
    return results
  } catch (error) {
    console.error("Transaction failed:", error)
    throw error
  }
}
