import { useEffect, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

type Course = {
    courseName: string
    courseCode: string
    description: string
    mainCategory: string
    shortCourse: string
    courseType: string
    pricePaise: number
    priceUsdCents: number
    mangoId: string
    refundable: boolean
}
function formatPrice(course: Course, country: "IN" | "US") {
    if (country === "IN") {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(course.pricePaise / 100)
    }

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(course.priceUsdCents / 100)
}
type CourseGridProps = {
    cardGap?: number
    cardRadius?: number
}

export default function CourseGrid({
    cardGap = 24,
    cardRadius = 16,
}: CourseGridProps) {
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [country, setCountry] = useState<"IN" | "US">("IN")
    const [retryCount, setRetryCount] = useState(0)
    useEffect(() => {
        const loadCourses = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await fetch(
                    "https://syncsphere-hiv6.onrender.com/assignment/course-data"
                )

                if (!response.ok) {
                    throw new Error(`Request failed: ${response.status}`)
                }

                const data: Course[] = await response.json()

                setCourses(data)
            } catch {
                setError("Unable to load courses.")
            } finally {
                setLoading(false)
            }
        }

        const loadCountry = async () => {
            try {
                const response = await fetch(
                    "https://syncsphere-hiv6.onrender.com/assignment/country-code"
                )

                if (!response.ok) {
                    throw new Error(
                        `Country request failed: ${response.status}`
                    )
                }

                const data: { country_code: "IN" | "US" } =
                    await response.json()

                setCountry(data.country_code)
            } catch {
                // Keep INR as the fallback currency
                setCountry("IN")
            }
        }

        loadCourses()
        loadCountry()
    }, [retryCount])

    if (loading) {
        return <div style={{ padding: "20px" }}>Loading courses...</div>
    }

    if (error) {
        return (
            <div
                style={{
                    padding: "40px",
                    textAlign: "center",
                }}
            >
                <h3>Unable to load courses.</h3>

                <p>Something went wrong while loading the courses.</p>

                <button
                    onClick={() => setRetryCount((count) => count + 1)}
                    style={{
                        padding: "10px 18px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Try Again
                </button>
            </div>
        )
    }

    if (courses.length === 0) {
        return <div style={{ padding: "20px" }}>No courses available.</div>
    }
    return (
        <div
            style={{
                width: "100%",
                maxWidth: "100%",
                minWidth: 0,
                boxSizing: "border-box",
                padding: "20px",
            }}
        >
            <h2
                style={{
                    margin: "0 0 12px",
                    textAlign: "center",
                    fontSize: "42px",
                    lineHeight: 1.1,
                    letterSpacing: "-0.03em",
                }}
            >
                Explore our courses
            </h2>

            <p
                style={{
                    margin: "0 0 40px",
                    textAlign: "center",
                    color: "#666666",
                    fontSize: "16px",
                }}
            >
                Learn practical skills and build your future.
            </p>

            <div
                style={{
                    width: "100%",
                    minWidth: 0,
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
                    gap: `${cardGap}px`,
                }}
            >
                {courses.map((course) => (
                    <div
                        key={course.courseCode}
                        style={{
                            minWidth: 0,
                            boxSizing: "border-box",
                            padding: "28px",
                            border: "1px solid #e8e8e8",
                            borderRadius: `${cardRadius}px`,
                            background: "#ffffff",
                            overflow: "hidden",
                            minHeight: "280px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "12px",
                                fontWeight: 700,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                color: "#666666",
                                marginBottom: "14px",
                            }}
                        >
                            {course.mainCategory}
                        </div>

                        {course.refundable && (
                            <span
                                style={{
                                    display: "inline-block",
                                    marginBottom: "12px",
                                    padding: "5px 9px",
                                    borderRadius: "999px",
                                    background: "#eef7ee",
                                    color: "#267326",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                }}
                            >
                                Refundable
                            </span>
                        )}

                        <h3
                            style={{
                                margin: "0 0 10px",
                                fontSize: "22px",
                                lineHeight: 1.2,
                                fontWeight: 700,
                                letterSpacing: "-0.02em",
                            }}
                        >
                            {course.courseName}
                        </h3>

                        <p
                            style={{
                                margin: "0 0 24px",
                                color: "#666666",
                                lineHeight: 1.55,
                                fontSize: "14px",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}
                        >
                            {course.description}
                        </p>

                        <div
                            style={{
                                marginTop: "auto",
                                paddingTop: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "16px",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "22px",
                                    fontWeight: 750,
                                    letterSpacing: "-0.02em",
                                    color: "#111111",
                                }}
                            >
                                {formatPrice(course, country)}
                            </div>

                            <button
                                onClick={() => {
                                    console.log(
                                        "Selected course:",
                                        course.mangoId
                                    )
                                }}
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    padding: 0,
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "#111111",
                                    whiteSpace: "nowrap",
                                    cursor: "pointer",
                                }}
                            >
                                View course →
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
CourseGrid.defaultProps = {
    cardGap: 24,
    cardRadius: 16,
}

addPropertyControls(CourseGrid, {
    cardGap: {
        type: ControlType.Number,
        title: "Card Gap",
        min: 8,
        max: 48,
        step: 1,
        defaultValue: 24,
    },

    cardRadius: {
        type: ControlType.Number,
        title: "Card Radius",
        min: 0,
        max: 32,
        step: 1,
        defaultValue: 16,
    },
})
