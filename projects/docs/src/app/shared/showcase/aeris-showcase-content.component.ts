import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { AerisAccordionModule } from '@aeris-ui/core/accordion';
import { AerisAvatarModule } from '@aeris-ui/core/avatar';
import { AerisBadgeModule } from '@aeris-ui/core/badge';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCardModule } from '@aeris-ui/core/card';
import {
  AerisChartModule,
  createAerisChartAreaFill,
  type AerisChartData,
  type AerisChartOptions,
} from '@aeris-ui/core/chart';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';
import { AerisChipModule } from '@aeris-ui/core/chip';
import { AerisDivider } from '@aeris-ui/core/divider';
import { AerisIconField } from '@aeris-ui/core/icon-field';
import { AerisInputGroup } from '@aeris-ui/core/input-group';
import { AerisInputNumber } from '@aeris-ui/core/input-number';
import { AerisInputOtp } from '@aeris-ui/core/input-otp';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisMessageModule } from '@aeris-ui/core/message';
import { AerisMeterGroupModule, type AerisMeterGroupItem } from '@aeris-ui/core/meter-group';
import { AerisProgressBarModule } from '@aeris-ui/core/progress-bar';
import { AerisRating } from '@aeris-ui/core/rating';
import { AerisSelect, type AerisSelectOption } from '@aeris-ui/core/select';
import { AerisSlider } from '@aeris-ui/core/slider';
import {
  AerisTableModule,
  type AerisTableColumn,
  type AerisTableData,
  type AerisTableSelectionEvent,
  type AerisTableSort,
} from '@aeris-ui/core/table';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import { AerisTextarea } from '@aeris-ui/core/textarea';
import { AerisToolbarModule } from '@aeris-ui/core/toolbar';
import { AerisToggleSwitch } from '@aeris-ui/core/toggle-switch';
import { AerisTooltip } from '@aeris-ui/core/tooltip';
import {
  LucideArrowDownLeft,
  LucideArrowLeft,
  LucideArrowUp,
  LucideArrowUpRight,
  LucideDynamicIcon,
  LucideInbox,
  LucideMessageCircle,
  LucideMoreHorizontal,
  LucideSend,
  LucideSendHorizontal,
  LucideUsers,
  LucideWalletCards,
} from '@lucide/angular';

import { DOC_ICONS } from '../documentation/doc-icons';
export type ShowcaseView = 'components' | 'dashboard' | 'chat' | 'crm' | 'mail' | 'finances';

interface DashboardTask {
  readonly label: string;
  readonly owner: string;
  readonly done: boolean;
}

interface DashboardActivity {
  readonly initials: string;
  readonly person: string;
  readonly title: string;
  readonly time: string;
  readonly status: string;
}

interface ChatThread {
  readonly id: string;
  readonly name: string;
  readonly initials: string;
  readonly preview: string;
  readonly time: string;
  readonly unread?: number;
}

interface ChatMessage {
  readonly id: number;
  readonly author: string;
  readonly text: string;
  readonly time: string;
}

type MailFolder = 'inbox' | 'sent' | 'archive' | 'trash';

interface MailItem {
  readonly id: string;
  readonly sender: string;
  readonly initials: string;
  readonly subject: string;
  readonly preview: string;
  readonly body: string;
  readonly time: string;
  readonly unread?: boolean;
  readonly label?: string;
}

interface CrmLead extends AerisTableData {
  readonly id: string;
  readonly company: string;
  readonly contact: string;
  readonly initials: string;
  readonly title: string;
  readonly stage: string;
  readonly value: number;
  readonly valueLabel: string;
  readonly probability: number;
}

interface Transaction {
  readonly id: string;
  readonly merchant: string;
  readonly category: string;
  readonly date: string;
  readonly amount: string;
  readonly incoming?: boolean;
}

const SHOWCASE_ICONS = {
  ...DOC_ICONS,
  ArrowDownLeft: LucideArrowDownLeft,
  ArrowLeft: LucideArrowLeft,
  ArrowUp: LucideArrowUp,
  ArrowUpRight: LucideArrowUpRight,
  Inbox: LucideInbox,
  MessageCircle: LucideMessageCircle,
  MoreHorizontal: LucideMoreHorizontal,
  Send: LucideSend,
  SendHorizontal: LucideSendHorizontal,
  Users: LucideUsers,
  WalletCards: LucideWalletCards,
} as const;

@Component({
  selector: 'app-aeris-showcase-content',
  imports: [
    AerisAccordionModule,
    AerisAvatarModule,
    AerisBadgeModule,
    AerisButton,
    AerisCardModule,
    AerisChartModule,
    AerisCheckbox,
    AerisChipModule,
    AerisDivider,
    AerisIconField,
    AerisInputGroup,
    AerisInputNumber,
    AerisInputOtp,
    AerisInputText,
    AerisMessageModule,
    AerisMeterGroupModule,
    AerisProgressBarModule,
    AerisRating,
    AerisSelect,
    AerisSlider,
    AerisTableModule,
    AerisTabsModule,
    AerisTextarea,
    AerisToolbarModule,
    AerisToggleSwitch,
    AerisTooltip,
    LucideDynamicIcon,
  ],
  templateUrl: './aeris-showcase-content.component.html',
  styleUrls: [
    './aeris-showcase-content.component.scss',
    './aeris-showcase-components.component.scss',
    './aeris-showcase-responsive.component.scss',
  ],
})
export class AerisShowcaseContentComponent {
  private static nextId = 0;
  protected readonly chatInputId = `showcase-chat-message-${AerisShowcaseContentComponent.nextId++}`;
  readonly activeView = input.required<ShowcaseView>();
  readonly viewRequested = output<ShowcaseView>();
  private readonly document = inject(DOCUMENT);

  protected readonly icons = SHOWCASE_ICONS;
  protected readonly toggle = (value: boolean): boolean => !value;
  protected readonly mailFolders = [
    { id: 'inbox', label: 'Inbox', icon: SHOWCASE_ICONS.Inbox },
    { id: 'sent', label: 'Sent', icon: SHOWCASE_ICONS.Send },
    { id: 'archive', label: 'Archive', icon: SHOWCASE_ICONS.Archive },
    { id: 'trash', label: 'Trash', icon: SHOWCASE_ICONS.Trash2 },
  ] as const;
  protected readonly componentTab = signal('forms');
  protected readonly componentSelect = signal<string | null>('design');
  protected readonly componentCheckbox = signal(true);
  protected readonly componentToggle = signal(true);
  protected readonly componentSlider = signal(64);
  protected readonly componentOtp = signal('4821');
  protected readonly componentRating = signal(4);
  protected readonly componentNotice = signal('Changes are saved only in this preview.');
  protected readonly showAllActivity = signal(false);
  protected readonly completedTasks = signal<readonly string[]>([
    'Review mobile navigation',
    'Approve release notes',
  ]);
  protected readonly taskProgress = computed(() =>
    Math.round((this.completedTasks().length / this.dashboardTasks.length) * 100),
  );
  protected readonly activeThreadId = signal('maya');
  protected readonly readThreads = signal<readonly string[]>(['maya']);
  protected readonly chatSearch = signal('');
  protected readonly chatInfoOpen = signal(false);
  protected readonly newConversationOpen = signal(false);
  protected readonly conversationRecipient = signal<string | null>('sofia');
  protected readonly threadMessages = signal<Readonly<Record<string, readonly ChatMessage[]>>>({});
  protected readonly visibleThreads = computed(() => {
    const query = this.chatSearch().trim().toLowerCase();
    return this.threads.filter((thread) =>
      `${thread.name} ${thread.preview} ${(
        this.threadMessages()[thread.id] ?? (thread.id === 'maya' ? this.initialChatMessages : [])
      )
        .map((message) => message.text)
        .join(' ')}`
        .toLowerCase()
        .includes(query),
    );
  });
  protected readonly conversationOptions = computed(() =>
    this.threads.map((thread) => ({ label: thread.name, value: thread.id })),
  );
  protected readonly chatDraft = signal('');
  protected readonly canSendMessage = computed(() => this.chatDraft().trim().length > 0);
  private readonly initialChatMessages: readonly ChatMessage[] = [
    { id: 1, author: 'Maya', text: 'The release dashboard is ready for review.', time: '10:18' },
    {
      id: 2,
      author: 'You',
      text: 'Great. I’ll check the mobile states before lunch.',
      time: '10:21',
    },
    {
      id: 3,
      author: 'Maya',
      text: 'Perfect—I added the latest accessibility notes too.',
      time: '10:22',
    },
    {
      id: 4,
      author: 'Maya',
      text: 'The updated prototype is attached to the release brief.',
      time: '10:24',
    },
    {
      id: 5,
      author: 'You',
      text: 'Opening it now. I’ll leave the final notes in the brief.',
      time: '10:26',
    },
  ];
  protected readonly chatMessages = computed(
    () =>
      this.threadMessages()[this.activeThreadId()] ??
      (this.activeThreadId() === 'maya'
        ? this.initialChatMessages
        : [
            {
              id: 1,
              author: this.activeThread().name,
              text: this.activeThread().preview,
              time: this.activeThread().time,
            },
          ]),
  );
  protected readonly selectedMailId = signal('release');
  protected readonly mailMobileView = signal<'list' | 'reader'>('list');
  protected readonly composeOpen = signal(false);
  protected readonly mailFeedback = signal('');
  protected readonly mailFolder = signal<MailFolder>('inbox');
  protected readonly mailSearch = signal('');
  protected readonly mailLocations = signal<Readonly<Record<string, MailFolder>>>({});
  protected readonly sentMails = signal<readonly MailItem[]>([]);
  protected readonly composeTo = signal('release@northstar.dev');
  protected readonly composeSubject = signal('Release follow-up');
  protected readonly composeBody = signal('');
  protected readonly visibleMails = computed(() => {
    const query = this.mailSearch().trim().toLowerCase();
    return [...this.mails, ...this.sentMails()].filter(
      (mail) =>
        (this.mailLocations()[mail.id] ?? 'inbox') === this.mailFolder() &&
        `${mail.sender} ${mail.subject} ${mail.body}`.toLowerCase().includes(query),
    );
  });
  protected readonly mailFolderLabel = computed(
    () => this.mailFolder()[0].toUpperCase() + this.mailFolder().slice(1),
  );
  protected readonly crmFeedback = signal('');
  protected readonly scheduledFollowUps = signal<readonly string[]>([]);
  protected readonly followUpLeads = computed(() =>
    this.crmData().filter((lead) => this.scheduledFollowUps().includes(lead.id)),
  );
  protected readonly selectedFollowUpScheduled = computed(() =>
    this.scheduledFollowUps().includes(this.selectedCrmLead().id),
  );
  protected readonly leadFormOpen = signal(false);
  protected readonly leadValue = signal<number | null>(10000);
  protected readonly addedLeads = signal<readonly CrmLead[]>([]);
  protected readonly crmData = computed(() => [...this.crmLeads, ...this.addedLeads()]);
  protected readonly pipelineValue = computed(() =>
    this.crmData()
      .reduce((sum, lead) => sum + lead.value, 0)
      .toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }),
  );
  protected readonly crmFilter = signal('');
  protected readonly crmColumnFilters = signal<Readonly<Record<string, string>>>({});
  protected readonly crmSort = signal<AerisTableSort | null>({
    field: 'probability',
    direction: 'desc',
  });
  protected readonly crmSelectedKeys = signal<readonly string[]>(['1']);
  protected readonly crmFirst = signal(0);
  protected readonly financePeriod = signal<string | null>('month');
  protected readonly showAllTransactions = signal(false);
  protected readonly budgetThreshold = signal(88);
  protected readonly visibleTransactions = computed(() => {
    const transactions =
      this.financePeriod() === 'month'
        ? this.transactions.filter((item) => item.date.startsWith('Oct'))
        : this.transactions;
    return this.showAllTransactions() ? transactions : transactions.slice(0, 3);
  });
  protected readonly financeSummary = computed(() => {
    switch (this.financePeriod()) {
      case 'year':
        return {
          revenue: '$286,840',
          expenses: '$169,206',
          change: '+$117.6k',
          label: 'Annual spending',
        };
      case 'quarter':
        return {
          revenue: '$83,840',
          expenses: '$51,206',
          change: '+$32.6k',
          label: 'Quarterly spending',
        };
      default:
        return {
          revenue: '$31,840',
          expenses: '$18,206',
          change: '+$13.6k',
          label: 'Monthly spending',
        };
    }
  });

  protected readonly teamOptions: readonly AerisSelectOption[] = [
    { label: 'Design', value: 'design' },
    { label: 'Engineering', value: 'engineering' },
    { label: 'Research', value: 'research' },
  ];

  protected readonly componentMeters: readonly AerisMeterGroupItem[] = [
    { label: 'Complete', value: 64, tone: 'success' },
    { label: 'Review', value: 22, tone: 'warning' },
    { label: 'Planned', value: 14, tone: 'info' },
  ];

  protected readonly dashboardChartData: AerisChartData = {
    labels: ['Sep 2', 'Sep 9', 'Sep 16', 'Sep 23', 'Sep 30', 'Oct 7'],
    datasets: [
      { label: 'Completed', data: [48, 56, 52, 68, 71, 82], borderRadius: 6 },
      { label: 'Created', data: [42, 50, 47, 59, 64, 70], borderRadius: 6 },
    ],
  };

  protected readonly compactChartOptions: AerisChartOptions = {
    devicePixelRatio:
      typeof window === 'undefined'
        ? 2
        : Math.max(window.devicePixelRatio, Math.min(4, window.devicePixelRatio * 2)),
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: { display: false } },
  };

  protected readonly dashboardTasks: readonly DashboardTask[] = [
    { label: 'Review mobile navigation', owner: 'Maya · 10:30', done: true },
    { label: 'Approve release notes', owner: 'Noah · 12:00', done: true },
    { label: 'Validate billing flow', owner: 'Sofia · 14:30', done: false },
    { label: 'Publish weekly summary', owner: 'Elias · 16:00', done: false },
  ];

  protected readonly dashboardActivity: readonly DashboardActivity[] = [
    {
      initials: 'MC',
      person: 'Maya Chen',
      title: 'Moved mobile refresh to review',
      time: '8 min ago',
      status: 'Review',
    },
    {
      initials: 'NW',
      person: 'Noah Williams',
      title: 'Completed the accessibility audit',
      time: '24 min ago',
      status: 'Complete',
    },
    {
      initials: 'SR',
      person: 'Sofia Rossi',
      title: 'Added three research findings',
      time: '1 hr ago',
      status: 'New',
    },
  ];

  protected readonly financePeriods: readonly AerisSelectOption[] = [
    { label: 'This month', value: 'month' },
    { label: 'This quarter', value: 'quarter' },
    { label: 'This year', value: 'year' },
  ];

  protected readonly threads: readonly ChatThread[] = [
    {
      id: 'maya',
      name: 'Maya Chen',
      initials: 'MC',
      preview: 'I added the accessibility notes too.',
      time: '10:22',
      unread: 2,
    },
    {
      id: 'release',
      name: 'Release team',
      initials: 'RT',
      preview: 'Noah shared a new preview.',
      time: '09:48',
    },
    {
      id: 'sofia',
      name: 'Sofia Rossi',
      initials: 'SR',
      preview: 'The research summary is ready.',
      time: 'Yesterday',
    },
    {
      id: 'design',
      name: 'Design systems',
      initials: 'DS',
      preview: '3 new component proposals',
      time: 'Mon',
      unread: 3,
    },
    {
      id: 'noah',
      name: 'Noah Williams',
      initials: 'NW',
      preview: 'I can take the browser checks.',
      time: 'Fri',
    },
    {
      id: 'support',
      name: 'Customer support',
      initials: 'CS',
      preview: 'Weekly report is ready.',
      time: 'Thu',
      unread: 6,
    },
  ];

  protected readonly activeThread = computed(
    () => this.threads.find((thread) => thread.id === this.activeThreadId()) ?? this.threads[0],
  );

  protected readonly mails: readonly MailItem[] = [
    {
      id: 'release',
      sender: 'Maya Chen',
      initials: 'MC',
      subject: 'Release review is ready',
      preview: 'The final accessibility and browser checks are attached…',
      body: 'Hi team,\n\nThe release review is ready. All critical accessibility checks passed, and the browser matrix is current. Please add any final notes before tomorrow at 11:00.\n\nThanks,\nMaya',
      time: '10:24',
      unread: true,
      label: 'Release',
    },
    {
      id: 'research',
      sender: 'Sofia Rossi',
      initials: 'SR',
      subject: 'Research synthesis',
      preview: 'Patterns from the latest onboarding sessions…',
      body: 'The latest onboarding sessions point to one clear opportunity: make project setup feel progressive instead of presenting every choice at once. I summarized the findings and recommended next steps.',
      time: '09:12',
      label: 'Research',
    },
    {
      id: 'billing',
      sender: 'Northstar Billing',
      initials: 'NB',
      subject: 'September invoice',
      preview: 'Your invoice is available for review.',
      body: 'Your September workspace invoice is now available. The total reflects twelve active seats and the annual support plan.',
      time: 'Yesterday',
      label: 'Finance',
    },
    {
      id: 'community',
      sender: 'Aeris Community',
      initials: 'AC',
      subject: 'Component feedback digest',
      preview: 'A concise summary of this week’s feedback…',
      body: 'This week the community focused on mobile overlays, keyboard interaction, and clearer validation guidance. Thank you for helping improve the library.',
      time: 'Mon',
    },
    {
      id: 'security',
      sender: 'Security review',
      initials: 'SC',
      subject: 'Audit completed',
      preview: 'No critical issues were found in the current release…',
      body: 'The scheduled security review is complete. No critical issues were found. Two documentation recommendations have been added to the release checklist.',
      time: 'Fri',
      label: 'Release',
    },
    {
      id: 'events',
      sender: 'Community events',
      initials: 'CE',
      subject: 'October contributor call',
      preview: 'Agenda and joining details for the next contributor call…',
      body: 'Our next contributor call is scheduled for October 18. We will cover the roadmap, documentation improvements, and upcoming accessibility work.',
      time: 'Thu',
    },
    {
      id: 'feedback',
      sender: 'Product feedback',
      initials: 'PF',
      subject: 'Mobile preview feedback',
      preview: 'The latest mobile preview tested well with the research group…',
      body: 'The latest mobile preview tested well with the research group. Participants particularly appreciated the simplified navigation and clearer validation states.',
      time: 'Wed',
      label: 'Research',
    },
    {
      id: 'renewal',
      sender: 'Workspace services',
      initials: 'WS',
      subject: 'Annual plan renewal',
      preview: 'Your workspace plan renews next month…',
      body: 'Your annual workspace plan renews next month. No action is required unless you want to change the number of active seats.',
      time: 'Tue',
      label: 'Finance',
    },
  ];

  protected readonly selectedMail = computed(
    () =>
      this.visibleMails().find((mail) => mail.id === this.selectedMailId()) ??
      this.visibleMails()[0],
  );

  protected readonly crmLeads: readonly CrmLead[] = [
    {
      id: '1',
      company: 'Northwind Labs',
      contact: 'Ava Morgan',
      initials: 'AM',
      title: 'VP Product',
      stage: 'Proposal',
      value: 28400,
      valueLabel: '$28,400',
      probability: 72,
    },
    {
      id: '2',
      company: 'Atlas Systems',
      contact: 'Elias Ford',
      initials: 'EF',
      title: 'Chief technology officer',
      stage: 'Discovery',
      value: 16800,
      valueLabel: '$16,800',
      probability: 45,
    },
    {
      id: '3',
      company: 'Relay Studio',
      contact: 'Nora Patel',
      initials: 'NP',
      title: 'Operations director',
      stage: 'Negotiation',
      value: 41200,
      valueLabel: '$41,200',
      probability: 84,
    },
    {
      id: '4',
      company: 'Keystone Health',
      contact: 'Leo Marin',
      initials: 'LM',
      title: 'Head of digital',
      stage: 'Qualified',
      value: 22600,
      valueLabel: '$22,600',
      probability: 61,
    },
    {
      id: '5',
      company: 'Juniper Works',
      contact: 'Iris Novak',
      initials: 'IN',
      title: 'Product lead',
      stage: 'Discovery',
      value: 14900,
      valueLabel: '$14,900',
      probability: 42,
    },
    {
      id: '6',
      company: 'Mosaic Cloud',
      contact: 'Theo Grant',
      initials: 'TG',
      title: 'Engineering director',
      stage: 'Proposal',
      value: 33700,
      valueLabel: '$33,700',
      probability: 76,
    },
    {
      id: '7',
      company: 'Cedar Finance',
      contact: 'Mila Chen',
      initials: 'MC',
      title: 'Transformation lead',
      stage: 'Qualified',
      value: 19500,
      valueLabel: '$19,500',
      probability: 58,
    },
    {
      id: '8',
      company: 'Summit Retail',
      contact: 'Owen Brooks',
      initials: 'OB',
      title: 'Commerce director',
      stage: 'Negotiation',
      value: 38900,
      valueLabel: '$38,900',
      probability: 81,
    },
    {
      id: '9',
      company: 'Beacon Energy',
      contact: 'Lena Ortiz',
      initials: 'LO',
      title: 'Program manager',
      stage: 'Discovery',
      value: 12400,
      valueLabel: '$12,400',
      probability: 36,
    },
    {
      id: '10',
      company: 'Harbor Logistics',
      contact: 'Max Turner',
      initials: 'MT',
      title: 'Operations VP',
      stage: 'Proposal',
      value: 26700,
      valueLabel: '$26,700',
      probability: 69,
    },
    {
      id: '11',
      company: 'Lumen Education',
      contact: 'Sara Bell',
      initials: 'SB',
      title: 'Learning systems lead',
      stage: 'Qualified',
      value: 21800,
      valueLabel: '$21,800',
      probability: 55,
    },
    {
      id: '12',
      company: 'Orbit Mobility',
      contact: 'Jonas Reed',
      initials: 'JR',
      title: 'Product operations lead',
      stage: 'Negotiation',
      value: 46500,
      valueLabel: '$46,500',
      probability: 88,
    },
  ];

  protected readonly crmColumns: readonly AerisTableColumn[] = [
    { field: 'company', header: 'Company', sortable: true, width: '34%' },
    { field: 'stage', header: 'Stage', sortable: true, width: '22%' },
    {
      field: 'value',
      header: 'Value',
      sortable: true,
      filterable: false,
      width: '18%',
      align: 'end',
    },
    {
      field: 'probability',
      header: 'Confidence',
      sortable: true,
      filterable: false,
      width: '26%',
      align: 'end',
    },
  ];

  protected readonly crmColumnFilterPlaceholders = {
    company: 'Company',
    stage: 'Stage',
  } as const;

  protected readonly selectedCrmLead = computed(
    () => this.crmData().find((lead) => lead.id === this.crmSelectedKeys()[0]) ?? this.crmLeads[0],
  );

  protected readonly pipeline: readonly AerisMeterGroupItem[] = [
    { label: 'Qualified', value: 31, tone: 'primary' },
    { label: 'Proposal', value: 27, tone: 'info' },
    { label: 'Negotiation', value: 22, tone: 'success' },
  ];

  protected readonly transactions: readonly Transaction[] = [
    {
      id: 'salary',
      merchant: 'Northstar payroll',
      category: 'Income',
      date: 'Oct 06',
      amount: '+$6,240.00',
      incoming: true,
    },
    {
      id: 'figma',
      merchant: 'Design tools',
      category: 'Software',
      date: 'Oct 05',
      amount: '−$148.00',
    },
    {
      id: 'office',
      merchant: 'Studio workspace',
      category: 'Operations',
      date: 'Oct 03',
      amount: '−$820.00',
    },
    {
      id: 'cloud',
      merchant: 'Cloud services',
      category: 'Infrastructure',
      date: 'Oct 01',
      amount: '−$236.40',
    },
    {
      id: 'travel',
      merchant: 'Rail Europe',
      category: 'Travel',
      date: 'Sep 29',
      amount: '−$184.20',
    },
    {
      id: 'client',
      merchant: 'Atlas Systems',
      category: 'Client payment',
      date: 'Sep 28',
      amount: '+$4,800.00',
      incoming: true,
    },
  ];

  protected readonly spending: readonly AerisMeterGroupItem[] = [
    { label: 'Operations', value: 36, tone: 'primary' },
    { label: 'Software', value: 24, tone: 'info' },
    { label: 'People', value: 18, tone: 'success' },
    { label: 'Other', value: 10, tone: 'warning' },
  ];

  protected readonly cashflowData = computed<AerisChartData>(() => {
    const period = this.financePeriod();
    const labels =
      period === 'year'
        ? ['Q1', 'Q2', 'Q3', 'Q4']
        : period === 'quarter'
          ? ['Aug', 'Sep', 'Oct']
          : ['Oct 1', 'Oct 8', 'Oct 15', 'Oct 22'];
    return {
      labels,
      datasets: [
        {
          label: 'Income ($k)',
          borderColor: '#2563eb',
          pointBackgroundColor: '#2563eb',
          backgroundColor: createAerisChartAreaFill('#2563eb', 0.12),
          data:
            period === 'year'
              ? [58, 65, 80, 84]
              : period === 'quarter'
                ? [25, 27, 31]
                : [6, 8, 7, 11],
          fill: true,
        },
        {
          label: 'Expenses ($k)',
          borderColor: '#db2777',
          backgroundColor: '#db2777',
          borderDash: [5, 4],
          fill: false,
          data:
            period === 'year'
              ? [36, 39, 43, 51]
              : period === 'quarter'
                ? [17, 16, 18]
                : [4, 5, 4, 5],
        },
      ],
    };
  });

  protected readonly chartOptions: AerisChartOptions = {
    devicePixelRatio:
      typeof window === 'undefined'
        ? 2
        : Math.max(window.devicePixelRatio, Math.min(4, window.devicePixelRatio * 2)),
    maintainAspectRatio: false,
    elements: {
      line: { borderWidth: 2, tension: 0.35 },
      point: { radius: 0, hoverRadius: 4 },
    },
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, pointStyle: 'line' },
      },
    },
  };

  protected showComponentNotice(message: string): void {
    this.componentNotice.set(message);
  }

  protected sendMessage(event: Event): void {
    event.preventDefault();
    const text = this.chatDraft().trim();
    if (!text) return;

    const messages = this.chatMessages();
    this.threadMessages.update((threads) => ({
      ...threads,
      [this.activeThreadId()]: [
        ...messages,
        { id: messages.length + 1, author: 'You', text, time: 'Now' },
      ],
    }));
    this.chatDraft.set('');
  }

  protected sendMail(event: Event): void {
    event.preventDefault();
    if (!(event.target instanceof HTMLFormElement) || !event.target.checkValidity()) return;
    const id = `sent-${this.sentMails().length + 1}`;
    this.sentMails.update((mails) => [
      ...mails,
      {
        id,
        sender: this.composeTo(),
        initials: 'YO',
        subject: this.composeSubject(),
        body: this.composeBody(),
        preview: this.composeBody(),
        time: 'Now',
      },
    ]);
    this.mailLocations.update((locations) => ({ ...locations, [id]: 'sent' }));
    this.mailFolder.set('sent');
    this.selectedMailId.set(id);
    this.composeOpen.set(false);
    this.mailFeedback.set('Message added to Sent. This preview does not send real email.');
    this.composeBody.set('');
  }

  protected selectMail(mailId: string): void {
    this.selectedMailId.set(mailId);
    this.composeOpen.set(false);
    this.mailMobileView.set('reader');
  }

  protected handleMailKeydown(event: KeyboardEvent, mailId: string): void {
    const mails = this.visibleMails();
    const index = mails.findIndex((mail) => mail.id === mailId);
    let next: number;
    switch (event.key) {
      case 'ArrowDown':
        next = Math.min(index + 1, mails.length - 1);
        break;
      case 'ArrowUp':
        next = Math.max(index - 1, 0);
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = mails.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const mail = mails[next];
    if (!mail) return;
    this.selectedMailId.set(mail.id);
    (event.currentTarget as HTMLElement).parentElement
      ?.querySelectorAll<HTMLButtonElement>('[role="option"]')
      .item(next)
      .focus();
  }

  protected openComposer(): void {
    this.composeOpen.set(true);
    this.mailMobileView.set('reader');
  }

  protected replyToMail(): void {
    const mail = this.selectedMail();
    if (!mail) return;
    this.composeSubject.set(`Re: ${mail.subject}`);
    this.composeTo.set(
      mail.sender.includes('@')
        ? mail.sender
        : `${mail.sender.toLowerCase().replaceAll(/[^a-z0-9]+/g, '.')}@northstar.example`,
    );
    this.composeBody.set('');
    this.openComposer();
  }

  protected scheduleFollowUp(): void {
    const lead = this.selectedCrmLead();
    this.scheduledFollowUps.update((ids) => [...ids.filter((id) => id !== lead.id), lead.id]);
    this.crmFeedback.set(`Follow-up with ${lead.contact} added to next actions.`);
  }

  protected addLead(): void {
    this.leadFormOpen.set(true);
  }

  protected createLead(event: Event): void {
    event.preventDefault();
    if (!(event.target instanceof HTMLFormElement)) return;
    const data = new FormData(event.target);
    const company = String(data.get('company') ?? '').trim();
    const contact = String(data.get('contact') ?? '').trim();
    if (!company || !contact) return;
    const value = this.leadValue() ?? 0;
    if (!Number.isFinite(value) || value < 0) return;
    const id = `new-${this.addedLeads().length + 1}`;
    this.addedLeads.update((leads) => [
      ...leads,
      {
        id,
        company,
        contact,
        initials: contact
          .split(/\s+/)
          .slice(0, 2)
          .map((name) => name[0])
          .join(''),
        title: 'New contact',
        stage: 'Discovery',
        value,
        valueLabel: value.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        }),
        probability: 30,
      },
    ]);
    this.resetCrmView();
    this.crmSelectedKeys.set([id]);
    this.crmSort.set(null);
    this.crmFirst.set(Math.floor((this.crmData().length - 1) / 5) * 5);
    this.leadFormOpen.set(false);
    this.crmFeedback.set(`${company} added to the pipeline.`);
  }

  protected selectFolder(folder: MailFolder): void {
    this.mailFolder.set(folder);
    this.mailSearch.set('');
    this.composeOpen.set(false);
    this.mailMobileView.set('list');
  }

  protected moveMail(folder: MailFolder): void {
    const mail = this.selectedMail();
    if (!mail) return;
    this.mailLocations.update((locations) => ({ ...locations, [mail.id]: folder }));
    this.mailMobileView.set('list');
    this.mailFeedback.set(`Message moved to ${folder}.`);
  }

  protected toggleTask(label: string, checked: boolean): void {
    this.completedTasks.update((tasks) =>
      checked
        ? [...tasks.filter((task) => task !== label), label]
        : tasks.filter((task) => task !== label),
    );
  }

  protected startConversation(): void {
    const recipient = this.conversationRecipient();
    if (recipient) this.selectThread(recipient);
    this.newConversationOpen.set(false);
    this.chatSearch.set('');
    this.chatDraft.set('');
  }

  protected selectThread(id: string): void {
    this.activeThreadId.set(id);
    this.chatDraft.set('');
    this.chatInfoOpen.set(false);
    this.readThreads.update((ids) => (ids.includes(id) ? ids : [...ids, id]));
  }

  protected exportDashboard(): void {
    this.downloadCsv('workspace-tasks.csv', [
      ['Task', 'Owner', 'Complete'],
      ...this.dashboardTasks.map((task) => [
        task.label,
        task.owner,
        String(this.completedTasks().includes(task.label)),
      ]),
    ]);
  }

  protected handleCrmSelection(event: AerisTableSelectionEvent): void {
    this.crmFeedback.set(`${String(event.row['company'])} selected.`);
  }

  protected resetCrmView(): void {
    this.crmFilter.set('');
    this.crmColumnFilters.set({});
    this.crmSort.set({ field: 'probability', direction: 'desc' });
    this.crmSelectedKeys.set(['1']);
    this.crmFirst.set(0);
    this.crmFeedback.set('Pipeline view reset.');
  }

  protected exportFinances(): void {
    const transactions =
      this.financePeriod() === 'month'
        ? this.transactions.filter((item) => item.date.startsWith('Oct'))
        : this.transactions;
    this.downloadCsv(`transactions-${this.financePeriod()}.csv`, [
      ['Merchant', 'Category', 'Date', 'Amount'],
      ...transactions.map((item) => [item.merchant, item.category, item.date, item.amount]),
    ]);
  }

  private downloadCsv(filename: string, rows: readonly (readonly string[])[]): void {
    const csv = rows
      .map((row) =>
        row
          .map((value) => {
            // Prevent spreadsheet formulas when exporting user-editable data.
            const safe = /^[=+@\-\t\r]/.test(value) ? `'${value}` : value;
            return `"${safe.replaceAll('"', '""')}"`;
          })
          .join(','),
      )
      .join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = this.document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
