"use client"

import React from 'react';

import ProfileCard from "@/app/(main)/profile/components/ProfileCard";

import { useAuthStore } from "@/store/authStore";
import { usePartnerStore } from "@/store/partnerStore";

export default function ProfilePage() {
	const { user } = useAuthStore()
	const { partner } = usePartnerStore()

  if (!user || !partner) {
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">내 프로필</h2>
          <ProfileCard user={user} />
        </div>
        {partner && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">커플 프로필</h2>
            <ProfileCard user={partner} />
          </div>
        )}
      </div>
    </div>
  )
}

