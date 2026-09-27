"use client";

import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { canEditProjects, canEditTours, canEditMasterData, canViewAuditLogs, canManageUsers, canDeleteProjects, canDeleteTours } from '@/lib/auth';

interface CanProps {
  perform: 'edit-projects' | 'edit-tours' | 'edit-masterdata' | 'view-audit' | 'manage-users' | 'delete-projects' | 'delete-tours';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function Can({ perform, children, fallback = null }: CanProps) {
  const [allowed, setAllowed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = getCurrentUser();
    const role = user?.role;

    let isPermitted = false;
    if (perform === 'edit-projects') isPermitted = canEditProjects(role);
    else if (perform === 'edit-tours') isPermitted = canEditTours(role);
    else if (perform === 'edit-masterdata') isPermitted = canEditMasterData(role);
    else if (perform === 'view-audit') isPermitted = canViewAuditLogs(role);
    else if (perform === 'manage-users') isPermitted = canManageUsers(role);
    else if (perform === 'delete-projects') isPermitted = canDeleteProjects(role);
    else if (perform === 'delete-tours') isPermitted = canDeleteTours(role);

    setAllowed(isPermitted);
  }, [perform]);

  if (!mounted) return null;
  return allowed ? <>{children}</> : <>{fallback}</>;
}
