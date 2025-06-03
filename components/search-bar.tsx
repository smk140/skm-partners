"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string, filters: Record<string, any>) => void
  className?: string
}

export function SearchBar({ placeholder = "지역 또는 건물명 입력", onSearch, className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({})
  const searchRef = useRef<HTMLDivElement>(null)

  // 예시 자동완성 데이터 - 실제로는 API에서 가져올 수 있습니다
  const suggestions = ["강남구 오피스", "테헤란로 상가", "송파구 빌딩", "분당 오피스", "종로구 상가"]

  // 필터 옵션
  const filterOptions = {
    type: ["오피스", "상가", "주거용", "공장/창고"],
    area: ["50평 미만", "50-100평", "100-200평", "200평 이상"],
    price: ["5천만원 미만", "5천-1억", "1억-2억", "2억 이상"],
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query, selectedFilters)
    }
    setShowSuggestions(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const addFilter = (category: string, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: value,
    }))
  }

  const removeFilter = (category: string) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev }
      delete newFilters[category]
      return newFilters
    })
  }

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className="flex w-full max-w-3xl mx-auto">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-4 py-6 text-lg rounded-l-lg border-r-0 focus-visible:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <Button onClick={handleSearch} className="rounded-l-none bg-blue-600 hover:bg-blue-700 px-6 py-6 text-lg">
          검색
        </Button>
      </div>

      {/* 자동완성 제안 */}
      {showSuggestions && (
        <div className="absolute z-10 w-full bg-white shadow-lg rounded-b-lg border mt-1 max-h-80 overflow-y-auto">
          <div className="p-2">
            <h3 className="text-sm font-medium text-slate-500 mb-1">추천 검색어</h3>
            {suggestions
              .filter((s) => s.toLowerCase().includes(query.toLowerCase()) || query === "")
              .map((suggestion, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-slate-100 cursor-pointer rounded"
                  onClick={() => {
                    setQuery(suggestion)
                    setShowSuggestions(false)
                  }}
                >
                  {suggestion}
                </div>
              ))}
          </div>

          {/* 필터 옵션 */}
          <div className="border-t p-2">
            <h3 className="text-sm font-medium text-slate-500 mb-1">필터</h3>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <h4 className="text-xs font-medium mb-1">건물 유형</h4>
                {filterOptions.type.map((option) => (
                  <div
                    key={option}
                    className="p-1 text-sm hover:bg-slate-100 cursor-pointer rounded"
                    onClick={() => {
                      addFilter("type", option)
                      setShowSuggestions(false)
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-xs font-medium mb-1">면적</h4>
                {filterOptions.area.map((option) => (
                  <div
                    key={option}
                    className="p-1 text-sm hover:bg-slate-100 cursor-pointer rounded"
                    onClick={() => {
                      addFilter("area", option)
                      setShowSuggestions(false)
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-xs font-medium mb-1">가격</h4>
                {filterOptions.price.map((option) => (
                  <div
                    key={option}
                    className="p-1 text-sm hover:bg-slate-100 cursor-pointer rounded"
                    onClick={() => {
                      addFilter("price", option)
                      setShowSuggestions(false)
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 선택된 필터 표시 */}
      {Object.keys(selectedFilters).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.entries(selectedFilters).map(([category, value]) => (
            <Badge key={category} variant="secondary" className="px-3 py-1">
              {value}
              <button onClick={() => removeFilter(category)} className="ml-2 text-slate-500 hover:text-slate-700">
                <X size={14} />
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={() => setSelectedFilters({})} className="text-xs h-7 px-2">
            필터 초기화
          </Button>
        </div>
      )}
    </div>
  )
}
