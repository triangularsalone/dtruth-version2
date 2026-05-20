"use client"

import { useState, type FormEvent } from "react"
import PartnerNextStepsForm from "./PartnerNextStepsForm"

interface PartnerNextStepsPageProps {
  searchParams: {
    email?: string
  }
}

export default function PartnerNextStepsPage({ searchParams }: PartnerNextStepsPageProps) {
  const email = searchParams.email ?? ""

  return <PartnerNextStepsForm email={email} />
}
