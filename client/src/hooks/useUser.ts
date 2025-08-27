import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: string;
  email: string;
  name?: string;
  familyGroupId?: string;
}

interface FamilyGroup {
  id: string;
  name: string;
  ownerEmail: string;
  inviteCode: string;
}

// Function to update manifest dynamically
function updateManifestWithFamilyName(appName: string) {
  // Create a new manifest object
  const manifest = {
    "name": appName,
    "short_name": appName,
    "description": "Family recipe management app with real-time sync and shared shopping lists",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#2563eb",
    "orientation": "portrait",
    "scope": "/",
    "lang": "ar",
    "dir": "rtl",
    "categories": ["food", "lifestyle", "productivity"],
    "icons": [
      {
        "src": "/icon-192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/icon-512.png", 
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any maskable"
      }
    ],
    "features": [
      "Real-time sync",
      "Offline support", 
      "Multi-language",
      "Recipe management",
      "Shopping lists",
      "Pantry management"
    ],
    "prefer_related_applications": false
  };
  
  // Convert to blob and create URL
  const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
  const manifestURL = URL.createObjectURL(manifestBlob);
  
  // Update manifest link
  let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
  if (manifestLink) {
    manifestLink.href = manifestURL;
  }
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [familyGroup, setFamilyGroup] = useState<FamilyGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const savedEmail = localStorage.getItem('userEmail');
      console.log('🔍 Saved email:', savedEmail);
      
      if (savedEmail) {
        const response = await apiRequest('GET', `/api/users/email/${savedEmail}`);
        const userData = await response.json();
        console.log('👤 User data:', userData);
        setUser(userData);
        
        if (userData.familyGroupId) {
          const groupResponse = await apiRequest('GET', `/api/family-groups/${userData.familyGroupId}`);
          const groupData = await groupResponse.json();
          console.log('👨‍👩‍👧‍👦 Family group data:', groupData);
          setFamilyGroup(groupData);
          
          // Update PWA title dynamically based on family name
          const appName = `${groupData.name} Nesting`;
          console.log('📱 Setting app name to:', appName);
          document.title = appName;
          
          // Update PWA meta tags
          const appleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
          if (appleTitle) {
            appleTitle.setAttribute('content', appName);
          }
          
          // Update manifest link to use dynamic manifest
          updateManifestWithFamilyName(appName);
        } else {
          // Reset to default name if no family group
          console.log('🏠 No family group, using default name');
          document.title = 'Family Nesting';
          const appleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
          if (appleTitle) {
            appleTitle.setAttribute('content', 'Family Nesting');
          }
          updateManifestWithFamilyName('Family Nesting');
        }
      } else {
        console.log('❌ No saved email found');
      }
    } catch (error) {
      console.error('💥 Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    familyGroup,
    isLoading,
    refreshUser: loadUser
  };
}