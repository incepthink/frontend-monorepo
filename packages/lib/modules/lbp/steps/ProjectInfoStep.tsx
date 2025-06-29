'use client'

import { Heading, VStack, Text, HStack, Spacer, Divider, Checkbox, Button } from '@chakra-ui/react'
import { useLbpForm } from '../LbpFormProvider'
import { ProjectInfoForm } from '../lbp.types'
import { Controller, SubmitHandler } from 'react-hook-form'
import { LbpFormAction } from '../LbpFormAction'
import { isValidUrl } from '@repo/lib/shared/utils/urls'
import { isValidTelegramHandle, isValidTwitterHandle } from '@repo/lib/shared/utils/strings'
import { InputWithError } from '@repo/lib/shared/components/inputs/InputWithError'
import { TextareaWithError } from '@repo/lib/shared/components/inputs/TextareaWithError'
import NextLink from 'next/link'
import { isAddress } from 'viem'
import { useUserAccount } from '@repo/lib/modules/web3/UserAccountProvider'

export function ProjectInfoStep() {
  const {
    projectInfoForm: {
      handleSubmit,
      formState: { isValid },
    },
    setActiveStep,
    activeStepIndex,
  } = useLbpForm()

  const onSubmit: SubmitHandler<ProjectInfoForm> = () => {
    setActiveStep(activeStepIndex + 1)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
      <VStack align="start" spacing="lg" w="full">
        <Heading color="font.maxContrast" size="md">
          Project info
        </Heading>

        <NameInput />
        <DescriptionInput />
        <TokenIconInput />
        <ProjectWebsiteUrlInput />
        <ProjectXHandle />
        <ProjectTelegramHandle />
        <ProjectDiscordUrlInput />
        <ProjectOwnerInput />

        <Divider />

        <Disclaimer />

        <LbpFormAction disabled={!isValid} />
      </VStack>
    </form>
  )
}

function NameInput() {
  const {
    projectInfoForm: {
      control,
      formState: { errors },
      watch,
    },
  } = useLbpForm()
  const length = watch('name').length
  const maxLength = 24

  return (
    <VStack align="start" w="full">
      <HStack w="full">
        <Text color="font.primary">Project name</Text>
        <Spacer />
        <Text color="font.secondary">{`${length}/${maxLength}`}</Text>
      </HStack>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <InputWithError
            error={errors.name?.message}
            isInvalid={!!errors.name}
            onChange={e => field.onChange(e.target.value)}
            value={field.value}
            maxLength={maxLength}
          />
        )}
        rules={{
          required: 'Project name is required',
        }}
      />
    </VStack>
  )
}

function DescriptionInput() {
  const {
    projectInfoForm: {
      control,
      formState: { errors },
      watch,
    },
  } = useLbpForm()

  const length = watch('description').length
  const maxLength = 240

  return (
    <VStack align="start" w="full">
      <HStack w="full">
        <Text color="font.primary">Project description</Text>
        <Spacer />
        <Text color="font.secondary">{`${length}/${maxLength}`}</Text>
      </HStack>
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <TextareaWithError
            error={errors.description?.message}
            isInvalid={!!errors.description}
            onChange={e => field.onChange(e.target.value)}
            placeholder="A brief description of your project and what the token will be used for."
            value={field.value}
            maxLength={maxLength}
            rows={4}
          />
        )}
        rules={{
          required: 'Project description is required',
        }}
      />
    </VStack>
  )
}

function TokenIconInput() {
  const {
    projectInfoForm: {
      control,
      formState: { errors },
    },
  } = useLbpForm()

  return (
    <VStack align="start" w="full">
      <Text color="font.primary">Token icon URL</Text>
      <Controller
        control={control}
        name="tokenIconUrl"
        render={({ field }) => (
          <InputWithError
            error={errors.tokenIconUrl?.message}
            isInvalid={!!errors.tokenIconUrl}
            onChange={e => field.onChange(e.target.value)}
            placeholder="https://yourdomain.com/token-icon.svg"
            value={field.value}
          />
        )}
        rules={{
          required: 'Token icon URL is required',
          validate: isValidUrl,
        }}
      />
    </VStack>
  )
}

function ProjectWebsiteUrlInput() {
  const {
    projectInfoForm: {
      control,
      formState: { errors },
    },
  } = useLbpForm()

  return (
    <VStack align="start" w="full">
      <Text color="font.primary">Project website URL</Text>
      <Controller
        control={control}
        name="websiteUrl"
        render={({ field }) => (
          <InputWithError
            error={errors.websiteUrl?.message}
            isInvalid={!!errors.websiteUrl}
            onChange={e => field.onChange(e.target.value)}
            placeholder="https://yourdomain.com"
            value={field.value}
          />
        )}
        rules={{
          required: 'Website URL is required',
          validate: isValidUrl,
        }}
      />
    </VStack>
  )
}

function ProjectXHandle() {
  const {
    projectInfoForm: {
      control,
      formState: { errors },
    },
  } = useLbpForm()

  return (
    <VStack align="start" w="full">
      <Text color="font.primary">X / Twitter handle</Text>
      <Controller
        control={control}
        name="xHandle"
        render={({ field }) => (
          <InputWithError
            error={errors.xHandle?.message}
            isInvalid={!!errors.xHandle}
            onChange={e => field.onChange(e.target.value)}
            placeholder="@yourhandle"
            value={field.value}
          />
        )}
        rules={{
          required: 'X / Twitter handle is required',
          validate: isValidTwitterHandle,
        }}
      />
    </VStack>
  )
}

function ProjectTelegramHandle() {
  const {
    projectInfoForm: {
      control,
      formState: { errors },
    },
  } = useLbpForm()

  return (
    <VStack align="start" w="full">
      <Text color="font.primary">Telegram handle (optional)</Text>
      <Controller
        control={control}
        name="telegramHandle"
        render={({ field }) => (
          <InputWithError
            error={errors.telegramHandle?.message}
            isInvalid={!!errors.telegramHandle}
            onChange={e => field.onChange(e.target.value)}
            placeholder="@yourhandle"
            value={field.value}
          />
        )}
        rules={{
          validate: isValidTelegramHandle,
        }}
      />
    </VStack>
  )
}

function ProjectDiscordUrlInput() {
  const {
    projectInfoForm: {
      control,
      formState: { errors },
    },
  } = useLbpForm()

  return (
    <VStack align="start" w="full">
      <Text color="font.primary">Discord URL (optional)</Text>
      <Controller
        control={control}
        name="discordUrl"
        render={({ field }) => (
          <InputWithError
            error={errors.discordUrl?.message}
            isInvalid={!!errors.discordUrl}
            onChange={e => field.onChange(e.target.value)}
            placeholder="https://yourdomain.com"
            value={field.value}
          />
        )}
        rules={{
          validate: isValidUrl,
        }}
      />
    </VStack>
  )
}

function ProjectOwnerInput() {
  const {
    projectInfoForm: {
      control,
      formState: { errors },
    },
  } = useLbpForm()

  const { userAddress } = useUserAccount()

  return (
    <VStack align="start" w="full">
      <Text color="font.primary">Project owner (optional)</Text>
      <Controller
        control={control}
        name="owner"
        render={({ field }) => (
          <InputWithError
            error={errors.owner?.message}
            isInvalid={!!errors.owner}
            onChange={e => field.onChange(e.target.value)}
            placeholder={userAddress}
            value={field.value}
          />
        )}
        rules={{
          validate: (value: string) => !value || isAddress(value) || 'Invalid address',
        }}
      />
    </VStack>
  )
}

function Disclaimer() {
  const {
    projectInfoForm: { control },
  } = useLbpForm()

  return (
    <Controller
      control={control}
      name="disclaimerAccepted"
      render={({ field }) => (
        <Checkbox
          color="font.primary"
          pl="md"
          size="lg"
          checked={field.value}
          onChange={field.onChange}
        >
          {'I accept the'}
          <Button
            as={NextLink}
            href={'/risks'}
            target="_blank"
            variant="link"
            textColor="font.link"
            px="0.3em"
          >
            Risks
          </Button>
          {'and'}
          <Button
            as={NextLink}
            href={'/terms-of-use'}
            target="_blank"
            variant="link"
            textColor="font.link"
            px="0.3em"
          >
            Terms of Use
          </Button>
          {'for creating and LBP.'}
        </Checkbox>
      )}
      rules={{ required: 'Conditions must be accepted' }}
    />
  )
}
