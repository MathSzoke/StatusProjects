import React, { useEffect, useState } from "react"
import {
    FluentProvider,
    webDarkTheme,
    Card,
    CardHeader,
    CardPreview,
    Text,
    Button,
    ProgressBar,
    Title1,
    Body1,
    makeStyles
} from "@fluentui/react-components"
import {
    ArrowJoinFilled,
    ArrowCounterclockwiseFilled
} from "@fluentui/react-icons"

const API_BASE = import.meta.env.VITE_API_BASE || ""

const useStyles = makeStyles({
    root: {
        minHeight: "100vh",
        backgroundColor: "#111827"
    },
    container: {
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "24px 16px 40px",
        display: "flex",
        flexDirection: "column",
        rowGap: "24px"
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        columnGap: "16px",
        rowGap: "12px",
        flexWrap: "wrap"
    },
    headerActions: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        rowGap: "8px"
    },
    lastUpdated: {
        color: "#6b7280"
    },
    subtitle: {
        color: "#9ca3af",
        marginTop: "4px"
    },
    errorBox: {
        borderRadius: "8px",
        padding: "8px 12px",
        backgroundColor: "#7f1d1d",
        color: "#fecaca",
        fontSize: "13px"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "16px"
    },
    card: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "16px",
        backgroundColor: "#020617",
        borderRadius: "10px"
    },
    cardHeaderContent: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%"
    },
    cardHeaderText: {
        fontSize: "14px"
    },
    cardPreview: {
        marginTop: "12px",
        marginBottom: "12px"
    },
    statusRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    latencyText: {
        color: "#9ca3af"
    },
    endpointText: {
        color: "#9ca3af",
        wordBreak: "break-word",
        overflowWrap: "anywhere",
        fontSize: "12px"
    },
    cardFooter: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        columnGap: "8px"
    },
    updatedTag: {
        color: "#6b7280"
    },
    emptyState: {
        gridColumn: "1 / -1",
        textAlign: "center",
        color: "#6b7280",
        paddingTop: "40px"
    },
    dotsContainer: {
        display: "flex",
        alignItems: "center",
        columnGap: "3px",
        paddingInline: "2px"
    },
    dot: {
        width: "4px",
        height: "4px",
        borderRadius: "50%",
        backgroundColor: "#e5e7eb",
        animationName: 'dots-bounce',
        animationDuration: "0.9s",
        animationIterationCount: "infinite",
        animationTimingFunction: "ease-in-out",
    },
    dot2: {
        animationDelay: "0.15s"
    },
    dot3: {
        animationDelay: "0.3s"
    }
})

function getStatusValue(status) {
    const s = String(status || "").toLowerCase()
    if (s === "active") return 100
    if (s === "lowactivity") return 60
    return 15
}

function getStatusLabel(status) {
    const s = String(status || "").toLowerCase()
    if (s === "active") return "Operacional"
    if (s === "lowactivity") return "Instável"
    return "Offline"
}

function getStatusColor(status) {
    const s = String(status || "").toLowerCase()
    if (s === "active") return "#16a34a"
    if (s === "lowactivity") return "#f97316"
    return "#ef4444"
}

function App() {
    const styles = useStyles()
    const [projects, setProjects] = useState([])
    const [isGlobalLoading, setIsGlobalLoading] = useState(false)
    const [loadingProjectId, setLoadingProjectId] = useState(null)
    const [error, setError] = useState(null)
    const [globalLastUpdated, setGlobalLastUpdated] = useState(null)
    const [projectUpdatedAt, setProjectUpdatedAt] = useState({})

    async function loadStatus() {
        try {
            setIsGlobalLoading(true)
            setLoadingProjectId(null)
            setError(null)

            const response = await fetch(`${API_BASE}/getStatusProjects`)
            if (!response.ok) {
                throw new Error(`Erro HTTP ${response.status}`)
            }

            const data = await response.json()
            const list = Array.isArray(data) ? data : []
            setProjects(list)

            const now = new Date().toLocaleString("pt-BR")
            setGlobalLastUpdated(now)
            setProjectUpdatedAt(prev => {
                const updated = { ...prev }
                list.forEach(p => {
                    updated[p.id] = now
                })
                return updated
            })
        } catch {
            setError("Não foi possível carregar o status dos projetos.")
        } finally {
            setIsGlobalLoading(false)
        }
    }

    async function loadSingleStatus(projectId, urlEndpoint) {
        try {
            setLoadingProjectId(projectId)
            setError(null)

            const response = await fetch(`${API_BASE}/refreshProject`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ urlEndpoint })
            })

            if (!response.ok) {
                throw new Error(`Erro HTTP ${response.status}`)
            }

            const updated = await response.json()

            setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p)))

            const now = new Date().toLocaleString("pt-BR")
            setProjectUpdatedAt(prev => ({
                ...prev,
                [updated.id]: now
            }))
            setGlobalLastUpdated(now)
        } catch {
            setError("Não foi possível carregar o status do projeto.")
        } finally {
            setLoadingProjectId(null)
        }
    }

    useEffect(() => {
        loadStatus()
    }, [])

    return (
        <FluentProvider theme={webDarkTheme} className={styles.root}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <Title1>Dashboard de Status</Title1>
                    <Body1 className={styles.subtitle}>
                        Monitoramento dos serviços do portfólio
                    </Body1>
                    <div className={styles.headerActions}>
                        <Button
                            appearance="primary"
                            onClick={loadStatus}
                            disabled={isGlobalLoading || !!loadingProjectId}
                        >
                            {isGlobalLoading ? "Atualizando..." : "Atualizar agora"}
                        </Button>
                        {globalLastUpdated && (
                            <Text size={200} className={styles.lastUpdated}>
                                Última atualização: {globalLastUpdated}
                            </Text>
                        )}
                    </div>
                </header>

                {error && <div className={styles.errorBox}>{error}</div>}

                <main className={styles.grid}>
                    {projects.map(project => {
                        const statusValue = getStatusValue(project.status)
                        const statusLabel = getStatusLabel(project.status)
                        const statusColor = getStatusColor(project.status)
                        const projectLastUpdated = projectUpdatedAt[project.id]

                        const isThisCardLoading =
                            isGlobalLoading || loadingProjectId === project.id

                        return (
                            <Card key={project.id} className={styles.card}>
                                <CardHeader
                                    header={
                                        <div className={styles.cardHeaderContent}>
                                            <Text
                                                weight="semibold"
                                                className={styles.cardHeaderText}
                                            >
                                                {project.name}
                                            </Text>
                                            {!isThisCardLoading && <Button
                                                appearance="secondary"
                                                size="small"
                                                icon={<ArrowCounterclockwiseFilled />}
                                                disabled={isGlobalLoading || isThisCardLoading}
                                                onClick={() =>
                                                    loadSingleStatus(
                                                        project.id,
                                                        project.urlEndpoint
                                                    )
                                                }
                                            >
                                            </Button>}
                                            {isThisCardLoading && (
                                                <Button style={{minHeight: '20px'}} appearance="secondary" size="small" disabled={isGlobalLoading || isThisCardLoading}>
                                                    <span className={styles.dotsContainer}>
                                                        <span className={styles.dot} />
                                                        <span className={`${styles.dot} ${styles.dot2}`} />
                                                        <span className={`${styles.dot} ${styles.dot3}`} />
                                                    </span>
                                                </Button>
                                            )}
                                        </div>
                                    }
                                />
                                <CardPreview className={styles.cardPreview}>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            rowGap: "8px"
                                        }}
                                    >
                                        <div className={styles.statusRow}>
                                            <Text
                                                weight="semibold"
                                                style={{ color: statusColor }}
                                            >
                                                {statusLabel}
                                            </Text>
                                            <Text
                                                size={200}
                                                className={styles.latencyText}
                                            >
                                                {project.latency > 0
                                                    ? `${project.latency} ms`
                                                    : "-- ms"}
                                            </Text>
                                        </div>
                                        <ProgressBar value={statusValue} max={100} />
                                    </div>
                                </CardPreview>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        rowGap: "8px"
                                    }}
                                >
                                    <Text size={200} className={styles.endpointText}>
                                        Destination: {project.urlRedirect}
                                    </Text>
                                    <div className={styles.cardFooter}>
                                        <Button
                                            appearance="secondary"
                                            size="small"
                                            onClick={() =>
                                                window.open(
                                                    project.urlRedirect,
                                                    "_blank",
                                                    "noopener"
                                                )
                                            }
                                            icon={<ArrowJoinFilled />}
                                        >
                                            Abrir projeto
                                        </Button>
                                        {projectLastUpdated && (
                                            <Text
                                                size={200}
                                                className={styles.updatedTag}
                                            >
                                                Atualizado em {projectLastUpdated}
                                            </Text>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        )
                    })}

                    {!isGlobalLoading && projects.length === 0 && !error && (
                        <div className={styles.emptyState}>
                            Nenhum projeto registrado ainda.
                        </div>
                    )}
                </main>
            </div>
        </FluentProvider>
    )
}

export default App
