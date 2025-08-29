import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Mail, Copy, UserPlus, Settings } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface FamilyGroup {
  id: string;
  name: string;
  ownerEmail: string;
  inviteCode: string;
  memberCount?: number;
}

interface User {
  id: string;
  email: string;
  name?: string;
  familyGroupId?: string;
}

export function EmailSync() {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [familyGroup, setFamilyGroup] = useState<FamilyGroup | null>(null);
  const [familyMembers, setFamilyMembers] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);

  useEffect(() => {
    checkUserStatus();
    // Create demo family for testing if no user exists
    createDemoFamily();
  }, []);
  
  const createDemoFamily = () => {
    // Only create demo if no user exists
    if (!localStorage.getItem('userEmail')) {
      setTimeout(() => {
        setFamilyGroup({
          id: 'demo-family',
          name: 'عائلة النمر',
          ownerEmail: 'demo@example.com',
          inviteCode: 'DEMO123',
          memberCount: 3
        });
      }, 1000);
    }
  };

  const checkUserStatus = async () => {
    try {
      // Try to get current user from localStorage first
      const savedEmail = localStorage.getItem('userEmail');
      if (savedEmail) {
        const response = await apiRequest('GET', `/api/users/email/${savedEmail}`);
        const userData = await response.json();
        setUser(userData);
        setEmail(savedEmail);
        setName(userData.name || '');
        
        if (userData.familyGroupId) {
          await loadFamilyGroup(userData.familyGroupId);
        }
      }
    } catch (error) {
      // User doesn't exist yet, will need to create
    }
  };

  const loadFamilyGroup = async (familyGroupId: string) => {
    try {
      const [groupResponse, membersResponse] = await Promise.all([
        apiRequest('GET', `/api/family-groups/${familyGroupId}`),
        apiRequest('GET', `/api/family-groups/${familyGroupId}/members`)
      ]);
      
      const groupData = await groupResponse.json();
      const membersData = await membersResponse.json();
      
      setFamilyGroup({ ...groupData, memberCount: membersData.length });
      setFamilyMembers(membersData);
    } catch (error) {
      console.error('Error loading family group:', error);
    }
  };

  const createUser = async () => {
    if (!email || !name) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/users', { email, name });
      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('userEmail', email);
      
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const createFamilyGroup = async () => {
    if (!groupName || !user) return;

    setIsLoading(true);
    try {
      const groupResponse = await apiRequest('POST', '/api/family-groups', {
        name: groupName,
        ownerEmail: user.email
      });
      const group = await groupResponse.json();
      
      // Join the created group
      await apiRequest('POST', `/api/family-groups/${group.id}/join`, {
        userId: user.id
      });
      
      await loadFamilyGroup(group.id);
      setIsSetupModalOpen(false);
      
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const joinFamilyGroup = async () => {
    if (!inviteCode || !user) return;

    setIsLoading(true);
    try {
      const groupResponse = await apiRequest('GET', `/api/family-groups/invite/${inviteCode}`);
      const group = await groupResponse.json();
      
      await apiRequest('POST', `/api/family-groups/${group.id}/join`, {
        userId: user.id
      });
      
      await loadFamilyGroup(group.id);
      setIsSetupModalOpen(false);
      
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const copyInviteCode = () => {
    if (familyGroup?.inviteCode) {
      navigator.clipboard.writeText(familyGroup.inviteCode);
    }
  };

  if (!user) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {t('setupEmailSync')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t('emailSyncDescription')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="email"
              placeholder={t('yourEmail')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="email-input"
            />
            <Input
              placeholder={t('yourName')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-testid="name-input"
            />
          </div>
          
          <Button
            onClick={createUser}
            disabled={isLoading || !email || !name}
            className="w-full"
            data-testid="create-user-button"
          >
            {isLoading ? t('loading') : t('setupAccount')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {t('familySync')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{user.name || user.email}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Badge variant={familyGroup ? "default" : "secondary"}>
            {familyGroup ? t('connected') : t('notConnected')}
          </Badge>
        </div>

        {familyGroup ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">{familyGroup.name}</p>
                <p className="text-sm text-muted-foreground">
                  {familyGroup.memberCount} {t('members')}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyInviteCode}
                data-testid="copy-invite-code"
              >
                <Copy className="h-4 w-4 mr-1" />
                {familyGroup.inviteCode}
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p>{t('familyMembers')}:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {familyMembers.map((member) => (
                  <Badge key={member.id} variant="outline" className="text-xs">
                    {member.name || member.email}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Dialog open={isSetupModalOpen} onOpenChange={setIsSetupModalOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" data-testid="setup-family-sync">
                <Settings className="h-4 w-4 mr-2" />
                {t('setupFamilySync')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('setupFamilySync')}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-medium">{t('createNewFamily')}</h4>
                  <Input
                    placeholder={t('familyGroupName')}
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    data-testid="group-name-input"
                  />
                  <Button
                    onClick={createFamilyGroup}
                    disabled={isLoading || !groupName}
                    className="w-full"
                    data-testid="create-family-group"
                  >
                    {t('createFamily')}
                  </Button>
                </div>
                
                <div className="text-center text-muted-foreground">
                  {t('or')}
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">{t('joinExistingFamily')}</h4>
                  <Input
                    placeholder={t('inviteCode')}
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    data-testid="invite-code-input"
                  />
                  <Button
                    onClick={joinFamilyGroup}
                    disabled={isLoading || !inviteCode}
                    variant="outline"
                    className="w-full"
                    data-testid="join-family-group"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {t('joinFamily')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}