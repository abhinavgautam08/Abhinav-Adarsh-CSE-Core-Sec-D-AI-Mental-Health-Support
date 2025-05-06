"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertTriangle, X, Phone, Globe } from "lucide-react"

interface CrisisResourcesProps {
  onClose: () => void
}

export function CrisisResources({ onClose }: CrisisResourcesProps) {
  return (
    <Alert variant="destructive" className="my-3 sm:my-4">
      <AlertTriangle className="h-4 w-4" />
      <div className="flex justify-between w-full">
        <div>
          <AlertTitle className="text-sm sm:text-base">Crisis Support</AlertTitle>
          <AlertDescription className="text-xs sm:text-sm">
            If you're experiencing a mental health emergency, please reach out for immediate help.
          </AlertDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 sm:h-8 sm:w-8">
          <X className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>

      <div className="grid gap-3 sm:gap-4 mt-3 sm:mt-4 md:grid-cols-2">
        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
            <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
            <h3 className="font-medium text-xs sm:text-sm">Crisis Hotlines</h3>
          </div>
          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <li>
              <strong>National Suicide Prevention Lifeline:</strong>
              <br />
              988 or 1-800-273-8255
            </li>
            <li>
              <strong>Crisis Text Line:</strong>
              <br />
              Text HOME to 741741
            </li>
            <li>
              <strong>Veterans Crisis Line:</strong>
              <br />
              988, then press 1
            </li>
          </ul>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
            <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
            <h3 className="font-medium text-xs sm:text-sm">Online Resources</h3>
          </div>
          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <li>
              <strong>SAMHSA Treatment Locator:</strong>
              <br />
              findtreatment.samhsa.gov
            </li>
            <li>
              <strong>National Alliance on Mental Illness:</strong>
              <br />
              nami.org/help
            </li>
            <li>
              <strong>International Association for Suicide Prevention:</strong>
              <br />
              iasp.info/resources
            </li>
          </ul>
        </Card>
      </div>

      <p className="mt-3 sm:mt-4 text-xs sm:text-sm">
        Remember: If you or someone else is in immediate danger, please call emergency services (911 in the US) right
        away.
      </p>
    </Alert>
  )
}
