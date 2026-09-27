"use client";

import React from 'react';
import EntityAuditHistorySection from './EntityAuditHistorySection';

interface AuditHistoryTabProps {
  entityName: string;
  entityId?: string | number;
}

export default function AuditHistoryTab({ entityName, entityId }: AuditHistoryTabProps) {
  return (
    <EntityAuditHistorySection
      entityName={entityName}
      entityId={entityId}
    />
  );
}
