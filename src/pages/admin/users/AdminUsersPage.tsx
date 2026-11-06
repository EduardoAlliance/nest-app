import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import {
  useCreateUser,
  useDeleteUser,
  useRestoreUser,
  useUpdateUser,
  useUsers,
} from '../../../hooks/useUsers'
import type { CreateUserDto, UpdateUserDto, User } from '../../../types'
import { roleLabel, roleVariant } from '@/lib/badges'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const userFormSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres').or(z.literal('')),
  role: z.enum(['admin', 'moderator', 'user']),
})

type UserForm = z.infer<typeof userFormSchema>

const emptyForm: UserForm = { name: '', email: '', password: '', role: 'user' }

export default function AdminUsersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const limit = 10

  const { data: paginated, isLoading } = useUsers({
    page,
    limit,
    search: search || undefined,
    role: roleFilter === 'all' ? undefined : roleFilter,
  })
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()
  const restoreUser = useRestoreUser()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserForm>({
    resolver: zodResolver(userFormSchema),
    defaultValues: emptyForm,
  })

  function openCreate() {
    setEditingUser(null)
    reset(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(user: User) {
    setEditingUser(user)
    reset({ name: user.name, email: user.email, password: '', role: user.role })
    setDialogOpen(true)
  }

  function closeDialog() {
    setDialogOpen(false)
    setEditingUser(null)
    reset(emptyForm)
  }

  function onSubmit(data: UserForm) {
    if (editingUser) {
      const payload: UpdateUserDto = {
        name: data.name,
        email: data.email,
        role: data.role,
      }
      if (data.password) payload.password = data.password
      updateUser.mutate(
        { id: editingUser.id, data: payload },
        { onSuccess: closeDialog },
      )
    } else {
      const payload: CreateUserDto = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      }
      createUser.mutate(payload, { onSuccess: closeDialog })
    }
  }

  const isSaving = createUser.isPending || updateUser.isPending
  const items = paginated?.items ?? []
  const total = paginated?.meta.total ?? 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Gestión de usuarios
          </h1>
          <p className="text-sm text-muted-foreground">
            Crea, edita y administra las cuentas de tu organización.
          </p>
        </div>
        <Button onClick={openCreate} size="lg" className="h-9">
          <Plus data-icon="inline-start" />
          Nuevo usuario
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nombre o email..."
              className="h-9 pr-9 pl-9"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
            />
            {search && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="absolute top-1/2 right-1 -translate-y-1/2"
                aria-label="Limpiar búsqueda"
                onClick={() => {
                  setSearch('')
                  setPage(1)
                }}
              >
                <X />
              </Button>
            )}
          </div>

          <Select
            value={roleFilter}
            onValueChange={(value) => {
              setRoleFilter(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="h-9 w-full sm:w-48">
              <SelectValue placeholder="Todos los roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="moderator">Moderador</SelectItem>
                <SelectItem value="user">Usuario</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle>Usuarios</CardTitle>
          <CardDescription>
            {total > 0
              ? `${total} ${total === 1 ? 'usuario registrado' : 'usuarios registrados'}`
              : 'Sin usuarios registrados'}
          </CardDescription>
        </CardHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner className="size-6 text-primary" />
          </div>
        ) : items.length === 0 ? (
          <Empty className="border-0 py-12">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Users />
              </EmptyMedia>
              <EmptyTitle>No se encontraron usuarios</EmptyTitle>
              <EmptyDescription>
                Prueba con otro término de búsqueda o cambia el filtro de rol.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="px-4">Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Verificado</TableHead>
                  <TableHead className="px-4 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((user) => (
                  <TableRow
                    key={user.id}
                    className={user.deletedAt ? 'opacity-60' : undefined}
                  >
                    <TableCell className="px-4 font-medium">
                      {user.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant={roleVariant(user.role)}>
                        {roleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.deletedAt ? 'outline' : 'success'}>
                        {user.deletedAt ? 'Inactivo' : 'Activo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.emailVerified ? 'success' : 'outline'}
                      >
                        {user.emailVerified ? 'Sí' : 'No'}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="flex items-center justify-end gap-1">
                        {user.deletedAt ? (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Restaurar usuario"
                            aria-label={`Restaurar a ${user.name}`}
                            onClick={() => restoreUser.mutate(user.id)}
                          >
                            <RotateCcw />
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              title="Editar usuario"
                              aria-label={`Editar a ${user.name}`}
                              onClick={() => openEdit(user)}
                            >
                              <Pencil />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              title="Eliminar usuario"
                              aria-label={`Eliminar a ${user.name}`}
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteTarget(user)}
                            >
                              <Trash2 />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {paginated && paginated.meta.totalPages > 1 && (
              <div className="flex flex-col items-center justify-between gap-3 border-t px-4 py-3 sm:flex-row">
                <span className="text-xs text-muted-foreground">
                  Página {paginated.meta.page} de {paginated.meta.totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!paginated.meta.hasPreviousPage}
                    onClick={() => setPage((current) => current - 1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!paginated.meta.hasNextPage}
                    onClick={() => setPage((current) => current + 1)}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDialog()
          else setDialogOpen(true)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Editar usuario' : 'Crear usuario'}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? 'Actualiza los datos de la cuenta. La contraseña es opcional.'
                : 'Completa los datos para dar de alta una nueva cuenta.'}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FieldGroup className="gap-4">
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="name">Nombre</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nombre completo"
                  className="h-9"
                  aria-invalid={!!errors.name}
                  {...register('name')}
                />
                <FieldError errors={[errors.name]} />
              </Field>

              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="h-9"
                  aria-invalid={!!errors.email}
                  {...register('email')}
                />
                <FieldError errors={[errors.email]} />
              </Field>

              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">
                  {editingUser ? 'Nueva contraseña' : 'Contraseña'}
                </FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  className="h-9"
                  aria-invalid={!!errors.password}
                  {...register('password')}
                />
                <FieldError errors={[errors.password]} />
                {editingUser && (
                  <FieldDescription>
                    Déjala vacía para conservar la contraseña actual.
                  </FieldDescription>
                )}
              </Field>

              <Field data-invalid={!!errors.role}>
                <FieldLabel htmlFor="role">Rol</FieldLabel>
                <Controller
                  control={control}
                  name="role"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="role" className="h-9 w-full">
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="user">Usuario</SelectItem>
                          <SelectItem value="moderator">Moderador</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[errors.role]} />
              </Field>
            </FieldGroup>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Spinner data-icon="inline-start" />
                    Guardando...
                  </>
                ) : editingUser ? (
                  'Guardar cambios'
                ) : (
                  'Crear usuario'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción desactivará la cuenta de{' '}
              <span className="font-medium text-foreground">
                {deleteTarget?.name}
              </span>
              . Podrás restaurarla más tarde desde esta misma tabla.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteUser.isPending}
              onClick={() => {
                if (deleteTarget) deleteUser.mutate(deleteTarget.id)
                setDeleteTarget(null)
              }}
            >
              {deleteUser.isPending ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Eliminando...
                </>
              ) : (
                'Eliminar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
