/* eslint-disable @next/next/no-img-element */
'use client'

import { Document } from '@inspetor/@types/document'
import { Button } from '@inspetor/components/ui/button'
import { toast } from '@inspetor/hooks/use-toast'
// import { saveImageConfigurationForReport } from '@/app/actions'
import { cn } from '@inspetor/lib/utils'
import { RotateCcw, Save, ZoomIn, ZoomOut } from 'lucide-react'
import React, { useRef, useState } from 'react'

interface ImageConfiguration {
  zoom: number
  position: {
    x: number
    y: number
  }
}

interface ImageAdjustProps {
  image: Document
  boxSize?: {
    width: number
    height: number
  }
  reportId: string
  pagePreview?: boolean
  imageIndex: number
  onUpdate?: (image: Document, imageIndex: number) => Promise<void>
}

const defaultConfiguration: ImageConfiguration = {
  position: {
    x: 0,
    y: 0,
  },
  zoom: 1,
}

export function ImageResizer({
  image,
  imageIndex,
  boxSize = { height: 300, width: 300 },
  pagePreview = false,
  onUpdate,
}: ImageAdjustProps) {
  const [configuration, setConfigurations] = useState<ImageConfiguration>(
    image.configs ?? defaultConfiguration,
  )
  const [isDraggingImage, setIsDraggingImage] = useState(false)
  const [startPosition, setStartPosition] = useState<{
    x: number
    y: number
  } | null>(null)

  const imageRef = useRef<HTMLImageElement>(null)

  const handleMakeZoomInOrZoomOut = (zoomType: 'in' | 'out') => {
    setConfigurations((currentConfig) => ({
      ...currentConfig,
      zoom:
        zoomType === 'in'
          ? currentConfig.zoom + 0.1
          : Math.max(0.1, currentConfig.zoom - 0.1),
    }))
  }

  const handleResetConfigurations = () => {
    setConfigurations(defaultConfiguration)
  }

  const handleSaveConfiguration = async () => {
    toast({
      title: 'Atualizando',
      description: `Atualizando configuração da imagem ${image.name}`,
      variant: 'default',
    })

    try {
      await onUpdate?.(
        {
          ...image,
          configs: configuration,
        },
        imageIndex,
      )

      toast({
        title: 'Sucesso',
        description: `Configuração da imagem ${image.name} foi atualizada com sucesso!`,
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: `Não foi possível atualizar a configuração da imagem ${image.name}`,
        variant: 'destructive',
      })
    }
  }

  const handleMouseDown = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>,
  ) => {
    setIsDraggingImage(true)
    setStartPosition({ x: event.clientX, y: event.clientY })
  }

  const handleMouseMove = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>,
  ) => {
    if (!pagePreview && isDraggingImage && startPosition) {
      const deltaX = event.clientX - startPosition.x
      const deltaY = event.clientY - startPosition.y

      setConfigurations((current) => ({
        ...current,
        position: {
          x: current.position.x + deltaX,
          y: current.position.y + deltaY,
        },
      }))

      setStartPosition({ x: event.clientX, y: event.clientY })
    }
  }

  const handleMouseUp = () => {
    setIsDraggingImage(false)
    setStartPosition(null)
  }

  return (
    <div className="group relative">
      <div
        className={cn(
          'z-50 w-fit absolute right-2 bottom-2 items-start justify-end gap-1 group-hover:flex hidden',
        )}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleMakeZoomInOrZoomOut('in')}
        >
          <ZoomIn className="size-4" />
        </Button>
        <Button
          onClick={() => handleMakeZoomInOrZoomOut('out')}
          variant="outline"
          size="icon"
        >
          <ZoomOut className="size-4" />
        </Button>
        <Button
          onClick={handleResetConfigurations}
          variant="outline"
          size="icon"
        >
          <RotateCcw className="size-4" />
        </Button>
        <Button onClick={handleSaveConfiguration} variant="outline" size="icon">
          <Save className="size-4" />
        </Button>
      </div>
      <div
        className="overflow-hidden border border-solid border-black relative"
        style={{
          height: boxSize.height,
          width: boxSize.width,
          maxHeight: boxSize.height,
          maxWidth: boxSize.width,
        }}
      >
        <img
          src={image.downloadUrl}
          ref={imageRef}
          alt=""
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onDragStart={(e) => e.preventDefault()}
          className={cn(
            'cursor-grab active:cursor-grabbing absolute top-0 left-0',
            !pagePreview && 'cursor-default active:cursor-not-allowed',
          )}
          style={{
            transform: `scale(${configuration.zoom})`,
            top: `${configuration.position.y}px`,
            left: `${configuration.position.x}px`,
          }}
        />
      </div>
    </div>
  )
}
