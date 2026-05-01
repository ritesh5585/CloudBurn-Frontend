"use client"

import { useState } from "react"
import { Users, Plus, MoreVertical, Mail, DollarSign, Target, UserPlus, Settings, Trash2, Crown, Briefcase, Code, ChevronRight, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import { Progress } from "@/shared/components/ui/progress"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/shared/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { cn } from "@/utils/utils"
import { teams, formatCurrency } from "@/api/mock-data"
import { useRole, getRoleBadgeColor, getRoleLabel } from "@/store/role-context"
import { PageHeader } from "@/shared/components/common/page-header"
import { StatCard } from "@/shared/components/common/stat-card"

const roleIcons = { admin: Crown, lead: Briefcase, developer: Code }

function MemberAvatar({ member, size = "md" }) {
  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm"
  return (
    <Avatar className={sizeClass}>
      <AvatarFallback className="bg-primary/10 text-primary">
        {member.name.split(" ").map((n) => n[0]).join("")}
      </AvatarFallback>
    </Avatar>
  )
}

function TeamCard({ team }) {
  const { canEdit } = useAuth()
  const budgetUsage = Math.round((team.monthlyCost / team.budget) * 100)

  return (
    <Card className="hover:border-primary/30 transition-all animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{team.name}</h3>
              <p className="text-sm text-muted-foreground">{team.members.length} member{team.members.length !== 1 && "s"}</p>
            </div>
          </div>
          {canEdit("teams") && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem><UserPlus className="w-4 h-4 mr-2" />Add Member</DropdownMenuItem>
                <DropdownMenuItem><Settings className="w-4 h-4 mr-2" />Team Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />Delete Team</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Budget Usage</span>
            </div>
            <span className={cn("text-sm font-medium", budgetUsage > 90 ? "text-destructive" : budgetUsage > 75 ? "text-warning-foreground" : "text-foreground")}>
              {budgetUsage}%
            </span>
          </div>
          <Progress value={budgetUsage} className="h-2" />
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-muted-foreground">{formatCurrency(team.monthlyCost)} used</span>
            <span className="text-xs text-muted-foreground">{formatCurrency(team.budget)} budget</span>
          </div>
        </div>

        <div className="flex items-center -space-x-2 mb-4">
          {team.members.slice(0, 4).map((member) => <MemberAvatar key={member.id} member={member} size="sm" />)}
          {team.members.length > 4 && (
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
              +{team.members.length - 4}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {team.services.slice(0, 3).map((service) => (
            <Badge key={service} variant="secondary" className="text-xs">{service}</Badge>
          ))}
          {team.services.length > 3 && <Badge variant="outline" className="text-xs">+{team.services.length - 3}</Badge>}
        </div>
      </CardContent>
    </Card>
  )
}

function InviteMemberModal({ open, onOpenChange }) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("developer")
  const [team, setTeam] = useState("")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>Send an invitation to join your organization</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="inv-email">Email Address</Label>
            <Input id="inv-email" type="email" placeholder="colleague@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Team</Label>
            <Select value={team} onValueChange={setTeam}>
              <SelectTrigger><SelectValue placeholder="Select a team" /></SelectTrigger>
              <SelectContent>
                {teams.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin"><div className="flex items-center gap-2"><Crown className="w-4 h-4" />Org Admin</div></SelectItem>
                <SelectItem value="lead"><div className="flex items-center gap-2"><Briefcase className="w-4 h-4" />Team Lead</div></SelectItem>
                <SelectItem value="developer"><div className="flex items-center gap-2"><Code className="w-4 h-4" />Developer</div></SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onOpenChange(false)}><Mail className="w-4 h-4 mr-2" />Send Invitation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function TeamsPage() {
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const { canEdit } = useAuth()

  const totalMembers = teams.reduce((sum, t) => sum + t.members.length, 0)
  const totalCost = teams.reduce((sum, t) => sum + t.monthlyCost, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teams"
        subtitle="Manage teams and cost ownership"
        actions={canEdit("teams") && (
          <>
            <Button variant="outline" onClick={() => setInviteModalOpen(true)}><UserPlus className="w-4 h-4 mr-2" />Invite Member</Button>
            <Button><Plus className="w-4 h-4 mr-2" />Create Team</Button>
          </>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard delay={0.05} label="Total Teams" value={teams.length}
          icon={<div className="p-2.5 rounded-xl bg-primary/10"><Users className="w-5 h-5 text-primary" /></div>} />
        <StatCard delay={0.1} label="Total Members" value={totalMembers}
          icon={<div className="p-2.5 rounded-xl bg-chart-2/10"><Shield className="w-5 h-5 text-chart-2" /></div>} />
        <StatCard delay={0.15} label="Combined Cost" value={formatCurrency(totalCost)}
          icon={<div className="p-2.5 rounded-xl bg-chart-1/10"><DollarSign className="w-5 h-5 text-chart-1" /></div>} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => <TeamCard key={team.id} team={team} />)}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base font-medium">All Members</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {teams.flatMap((team) =>
              team.members.map((member) => {
                const RoleIcon = roleIcons[member.role] || Code
                return (
                  <div key={member.id} className="flex items-center gap-4 px-6 py-4 hover:bg-accent/50 transition-colors">
                    <MemberAvatar member={member} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                    <Badge variant="outline" className={getRoleBadgeColor(member.role)}>
                      <RoleIcon className="w-3 h-3 mr-1" />{getRoleLabel(member.role)}
                    </Badge>
                    <Badge variant="secondary">{team.name}</Badge>
                    {canEdit("teams") && (
                      <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronRight className="w-4 h-4" /></Button>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      <InviteMemberModal open={inviteModalOpen} onOpenChange={setInviteModalOpen} />
    </div>
  )
}
