import React, { useState } from 'react'
import { Box, Button, Typography, Paper } from '@mui/material'
import { Add as AddIcon, People as PeopleIcon } from '@mui/icons-material'
import DistributionListManager, { Contact } from '../components/DistributionListManager'

const DistributionListManagerDemo: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      lastName: 'Senyk',
      firstName: 'Peter',
      email: 'Peter.Senyk@gmail.com',
      phone: '1-604-329-9559',
      company: 'BCIT'
    },
    {
      id: '2',
      lastName: 'Smith',
      firstName: 'Daylen',
      email: 'daylen.smith@gmail.com',
      phone: '1-604-329-9559',
      company: 'BCIT'
    }
  ])

  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <Box sx={{ p: 4, backgroundColor: 'background.default', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Distribution List Manager Demo
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
        {/* Dialog Mode Demo */}
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleIcon color="primary" />
            Dialog Mode
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Opens the distribution list manager as a modal dialog. Perfect for quick contact management without leaving the current page.
          </Typography>
          <Button
            variant="contained"
            onClick={() => setDialogOpen(true)}
            startIcon={<AddIcon />}
            sx={{ borderRadius: 2 }}
          >
            Open Distribution List Manager
          </Button>
        </Paper>

        {/* Page Mode Demo */}
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleIcon color="primary" />
            Page Mode
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Renders the distribution list manager as a full page. Ideal for dedicated contact management sessions.
          </Typography>
          <Button
            variant="outlined"
            component="a"
            href="/distribution-list-manager-page"
            sx={{ borderRadius: 2 }}
          >
            View Full Page
          </Button>
        </Paper>
      </Box>

      {/* Current Contacts Summary */}
      <Paper sx={{ p: 3, mt: 4, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Current Contacts ({contacts.length})
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {contacts.map(contact => (
            <Box
              key={contact.id}
              sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 1,
                backgroundColor: 'white'
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {contact.firstName} {contact.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {contact.company}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Distribution List Manager Dialog */}
      <DistributionListManager
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        contacts={contacts}
        onContactsChange={setContacts}
        title="Distribution List Manager"
        jobNumber="28599"
        mode="dialog"
      />
    </Box>
  )
}

export default DistributionListManagerDemo
