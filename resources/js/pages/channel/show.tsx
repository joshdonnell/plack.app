import { Form, Head, router } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import MessageController from '@/actions/App/Http/Controllers/MessageController';
import CreateChannelDialog from '@/components/create-channel-dialog';
import DeleteChannelDialog from '@/components/delete-channel-dialog';
import EditChannelDialog from '@/components/edit-channel-dialog';
import InputError from '@/components/input-error';
import WorkspaceLayout from '@/layouts/workspace-layout';

const NICK_COLORS = [
    'text-green',
    'text-user-violet',
    'text-user-blue',
    'text-user-clay',
] as const;

function nickColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = (hash + name.charCodeAt(i)) % NICK_COLORS.length;
    }
    return NICK_COLORS[hash];
}

function messageTime(iso: string): string {
    return new Date(iso).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: false,
    });
}

type Channel = {
    id: string;
    name: string;
    slug: string;
};

type Message = {
    id: string;
    body: string;
    sender: string;
    createdAt: string;
};

type WorkspaceSummary = {
    id: string;
    name: string;
    slug: string;
};

type Workspace = WorkspaceSummary & {
    channels: Channel[];
};

export default function ChannelShow({
    workspace,
    channel,
    messages,
    workspaces,
    canManage = false,
}: {
    workspace: Workspace;
    channel: Channel;
    messages: Message[];
    workspaces?: WorkspaceSummary[];
    canManage?: boolean;
}) {
    useEcho(`channels.${channel.id}`, '.MessageCreated', () => {
        router.reload({ only: ['messages'] });
    });

    useEcho(
        `workspaces.${workspace.id}`,
        ['.ChannelCreated', '.ChannelDeleted'],
        () => {
            router.reload({ only: ['workspace'] });
        },
    );

    useEcho(`workspaces.${workspace.id}`, '.ChannelUpdated', () => {
        router.reload({ only: ['workspace', 'channel'] });
    });

    return (
        <WorkspaceLayout
            workspace={workspace}
            workspaces={workspaces}
            activeChannelSlug={channel.slug}
            canManage={canManage}
        >
            <Head title={channel.name} />

            {/* header */}
            <header className="flex items-center justify-between gap-3 border-b border-line px-6 py-[15px]">
                <div className="flex items-baseline gap-3">
                    <span className="text-[15px] font-semibold text-amber">
                        # {channel.name}
                    </span>
                    <span className="text-[11px] text-mute">
                        {workspace.name}
                    </span>
                </div>

                {canManage && (
                    <div className="flex items-center gap-1">
                        <CreateChannelDialog workspaceSlug={workspace.slug} />
                        <EditChannelDialog
                            workspaceSlug={workspace.slug}
                            channel={channel}
                        />
                        <DeleteChannelDialog
                            workspaceSlug={workspace.slug}
                            channel={channel}
                        />
                    </div>
                )}
            </header>

            {/* message log — bottom-anchored */}
            <div className="flex flex-1 flex-col justify-end gap-[14px] overflow-y-auto px-6 py-[18px] text-[12.5px] leading-[1.55]">
                {messages.length === 0 ? (
                    <div className="text-faint">
                        # no messages yet — say hello
                    </div>
                ) : (
                    messages.map((message) => (
                        <div key={message.id} className="break-words">
                            <span className={nickColor(message.sender)}>
                                {message.sender}
                            </span>
                            <span className="mx-2 text-faint">
                                {messageTime(message.createdAt)}
                            </span>
                            <span className="text-fg">{message.body}</span>
                        </div>
                    ))
                )}
            </div>

            {/* composer */}
            <Form
                {...MessageController.store.form([
                    workspace.slug,
                    channel.slug,
                ])}
                options={{ preserveScroll: true }}
                resetOnSuccess
                className="mx-6 mb-5"
            >
                {({ errors }) => (
                    <>
                        <div className="flex items-center gap-2 border border-line px-[14px] py-[11px] text-[12.5px]">
                            <span className="text-green">&gt;</span>
                            <input
                                type="text"
                                name="body"
                                placeholder={`message #${channel.name}`}
                                autoComplete="off"
                                className="min-w-0 flex-1 bg-transparent text-fg caret-green outline-none placeholder:text-faint"
                            />
                        </div>

                        <InputError message={errors.body} className="mt-2" />
                    </>
                )}
            </Form>
        </WorkspaceLayout>
    );
}
