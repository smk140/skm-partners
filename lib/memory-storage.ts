// 메모리 기반 이미지 저장소
class MemoryImageStorage {
  private images: Map<string, { data: string; metadata: any }> = new Map()

  saveImage(imageId: string, base64Data: string, metadata: any = {}) {
    console.log(`[MemoryStorage] 💾 이미지 저장: ${imageId}`)

    this.images.set(imageId, {
      data: base64Data,
      metadata: {
        ...metadata,
        created_at: new Date().toISOString(),
        size: base64Data.length,
      },
    })

    console.log(`[MemoryStorage] ✅ 이미지 저장 성공: ${imageId}`)
    console.log(`[MemoryStorage] 📊 총 저장된 이미지 수: ${this.images.size}`)
    return true
  }

  getImage(imageId: string) {
    console.log(`[MemoryStorage] 📖 이미지 읽기: ${imageId}`)

    const imageInfo = this.images.get(imageId)

    if (!imageInfo) {
      console.log(`[MemoryStorage] ⚠️ 이미지 없음: ${imageId}`)
      return null
    }

    console.log(`[MemoryStorage] ✅ 이미지 읽기 성공: ${imageId}`)
    return imageInfo
  }

  deleteImage(imageId: string) {
    console.log(`[MemoryStorage] 🗑️ 이미지 삭제: ${imageId}`)

    const deleted = this.images.delete(imageId)

    if (deleted) {
      console.log(`[MemoryStorage] ✅ 이미지 삭제 성공: ${imageId}`)
    } else {
      console.log(`[MemoryStorage] ⚠️ 삭제할 이미지 없음: ${imageId}`)
    }

    return deleted
  }

  getAllImages() {
    console.log(`[MemoryStorage] 📋 모든 이미지 조회`)
    return Array.from(this.images.entries()).map(([id, info]) => ({
      id,
      ...info,
    }))
  }

  getStorageInfo() {
    const totalSize = Array.from(this.images.values()).reduce((sum, img) => sum + (img.metadata.size || 0), 0)

    return {
      imageCount: this.images.size,
      totalSize,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
    }
  }
}

// 싱글톤 인스턴스
const memoryStorage = new MemoryImageStorage()

export default memoryStorage
