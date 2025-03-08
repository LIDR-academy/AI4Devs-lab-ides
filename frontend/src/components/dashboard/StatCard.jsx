import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

const StatCard = ({ title, value, icon, color }) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }} // 20% opacity of the color
          >
            <span style={{ color }}>{icon}</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

export default StatCard
