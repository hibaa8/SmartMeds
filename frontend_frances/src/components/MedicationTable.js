"use client"
import { formatDistanceToNow } from "date-fns"
import Button from "./ui/Button"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./ui/Table"
import { Check, Bell } from "react-feather"

const MedicationTable = ({ medications, onTakeDose }) => {
  const formatLastTaken = (dateString) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      return "Unknown"
    }
  }

  const formatTime = (timeString) => {
    try {
      return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (error) {
      return timeString;
    }
  }

  const formatReminderTimes = (medication) => {
    if (!medication.reminderTimes || !Array.isArray(medication.reminderTimes)) {
      return "Not set";
    }
    return medication.reminderTimes.map(formatTime).join(", ");
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Medication Name</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Reminder Times</TableHead>
            <TableHead>Last Taken</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {medications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                No medications added yet
              </TableCell>
            </TableRow>
          ) : (
            medications.map((medication) => (
              <TableRow key={medication.id}>
                <TableCell className="font-medium">{medication.name}</TableCell>
                <TableCell>{medication.duration}</TableCell>
                <TableCell>{medication.frequency}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
                    <div className="flex flex-col">
                      <span className="text-sm">
                        {formatReminderTimes(medication)}
                      </span>
                      {medication.notificationTime && (
                        <span className="text-xs text-gray-500">
                          {medication.notificationTime} mins before
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{formatLastTaken(medication.lastTaken)}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onTakeDose(medication.id)}
                    className="shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all"
                    style={{ 
                      borderColor: 'var(--color-primary)',
                      ['--tw-hover-bg']: 'var(--color-primary-light)',
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" style={{ color: 'var(--color-primary)' }} /> Take Dose
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default MedicationTable

