import { useState, useEffect, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { CalendarApi } from '@fullcalendar/core'
import { EventDropArg, type EventInput } from '@fullcalendar/core'
import { schedulingApiService } from '@/services/schedulingApiService'
import { jobsAPIService, apiService } from '@/services/apiService'
import { ENDPOINTS } from '@/config/endpoints'
import type { ScheduleJobReadDTO, GeoPacificEmployeeReadDTO } from '@/dtos/Scheduling/scheduleJob'
import type { JobReadDTO } from '@/dtos/Job/job'
import ScheduleEventDialog from './ScheduleEventDialog'

function unwrapList<T>(raw: unknown): T[] {
    if (Array.isArray(raw)) return raw
    if (raw && typeof raw === 'object') {
        const o = raw as Record<string, unknown>
        if (Array.isArray(o.data)) return o.data as T[]
        // Backend can return { data: { items: [...] } }
        if (o.data && typeof o.data === 'object' && Array.isArray((o.data as Record<string, unknown>).items))
            return (o.data as { items: T[] }).items
        if (Array.isArray(o.items)) return o.items as T[]
    }
    return []
}

export default function CalendarView() {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<ScheduleJobReadDTO | null>(null)
    const [createRange, setCreateRange] = useState<{ start: string; end: string } | null>(null)
    const [jobs, setJobs] = useState<JobReadDTO[]>([])
    const [technicians, setTechnicians] = useState<GeoPacificEmployeeReadDTO[]>([])
    const calendarRef = useRef<FullCalendar>(null)

    useEffect(() => {
        jobsAPIService.getAllJobs().then((res) => setJobs(unwrapList<JobReadDTO>(res.data)))
    }, [])

    useEffect(() => {
        apiService
            .get<unknown>(ENDPOINTS.PEOPLE.LIST)
            .then((res) => setTechnicians(unwrapList<GeoPacificEmployeeReadDTO>(res.data)))
            .catch(() => setTechnicians([]))
    }, [])

    const refetchEvents = () => {
        const api = calendarRef.current?.getApi() as CalendarApi | undefined
        api?.refetchEvents()
    }

    const handleClose = () => {
        setDialogOpen(false)
        setSelectedEvent(null)
        setCreateRange(null)
    }

    const handleMove = (info: EventDropArg) => {
        console.log(info.event.extendedProps)
    }
    const handleResize = () => {
        console.log("resize")
    }
    const handleSelect = (info: { start: Date; end: Date }) => {
        setCreateRange({ start: info.start.toISOString(), end: info.end.toISOString() })
        setSelectedEvent(null)
        setDialogOpen(true)
    }
    const handleEventClick = async (info: { event: { id: string } }) => {
        const id = Number(info.event.id)
        if (!Number.isFinite(id)) return
        setCreateRange(null)
        try {
            const res = await schedulingApiService.getScheduleJobByEventId(id)
            const body = res.data
            if (body.success && body.data) {
                setSelectedEvent(body.data)
                setDialogOpen(true)
            }
        } catch {
            setSelectedEvent(null)
            setDialogOpen(true)
        }
    }

    const fetchEvents = (info: { start: Date; end: Date }, successCallback: (events: EventInput[]) => void, failureCallback: (error: Error) => void) => {
        const startUtcIso = info.start.toISOString()
        const endUtcIso = info.end.toISOString()
        schedulingApiService
            .getEventsInRange(startUtcIso, endUtcIso)
            .then((response) => {
                const body = response.data
                if (body.success && body.data) {
                    const mapped: EventInput[] = body.data.map((dto: ScheduleJobReadDTO) => ({
                        id: String(dto.id),
                        title: `${dto.job.jobNumber} - ${dto.job.siteAddress}`,
                        start: dto.startDateTime,
                        end: dto.endDateTime,
                        extendedProps: {
                            jobId: dto.jobId,
                            jobNumber: dto.job.jobNumber,
                            siteAddress: dto.job.siteAddress,
                            status: dto.status,
                            geoPacificEmployeeId: dto.geoPacificEmployeeId,
                        },
                    }))
                    successCallback(mapped)
                } else {
                    failureCallback(new Error(body.message ?? 'Failed to load events'))
                }
            })
            .catch((err) => failureCallback(err instanceof Error ? err : new Error(String(err))))
    }

    return (
        <div>
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={fetchEvents}
                editable={true}
                selectable={true}
                timeZone="UTC"
                eventDrop={handleMove}
                eventResize={handleResize}
                select={handleSelect}
                eventClick={handleEventClick}
            />
            <ScheduleEventDialog
                open={dialogOpen}
                onClose={handleClose}
                initialEvent={selectedEvent}
                onSaved={() => { refetchEvents(); handleClose() }}
                onDeleted={() => { refetchEvents(); handleClose() }}
                jobs={jobs}
                employees={technicians}
                defaultStart={createRange?.start}
                defaultEnd={createRange?.end}
            />
        </div>
    )
}