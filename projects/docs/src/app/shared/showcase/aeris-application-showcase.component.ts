import { Component, computed, input, signal } from '@angular/core';
import { AerisAccordionModule } from '@aeris-ui/core/accordion';
import { AerisAvatarModule } from '@aeris-ui/core/avatar';
import { AerisBadgeModule } from '@aeris-ui/core/badge';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCardModule } from '@aeris-ui/core/card';
import {
  AerisChartModule,
  type AerisChartData,
  type AerisChartOptions,
} from '@aeris-ui/core/chart';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';
import { AerisChipModule } from '@aeris-ui/core/chip';
import { AerisDatePicker, type AerisDatePickerValue } from '@aeris-ui/core/date-picker';
import { AerisDialogModule } from '@aeris-ui/core/dialog';
import { AerisDivider } from '@aeris-ui/core/divider';
import { AerisFileUploadModule, type AerisFileUploadSelectEvent } from '@aeris-ui/core/file-upload';
import { AerisIconField } from '@aeris-ui/core/icon-field';
import { AerisInputNumber } from '@aeris-ui/core/input-number';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisMessageModule, type AerisMessageSeverity } from '@aeris-ui/core/message';
import { AerisMeterGroupModule, type AerisMeterGroupItem } from '@aeris-ui/core/meter-group';
import { AerisMultiSelect } from '@aeris-ui/core/multi-select';
import { AerisPanelModule } from '@aeris-ui/core/panel';
import { AerisProgressBarModule } from '@aeris-ui/core/progress-bar';
import { AerisRadioButton } from '@aeris-ui/core/radio-button';
import { AerisRating } from '@aeris-ui/core/rating';
import { AerisSelect, type AerisSelectOption } from '@aeris-ui/core/select';
import { AerisSkeleton } from '@aeris-ui/core/skeleton';
import { AerisSlider } from '@aeris-ui/core/slider';
import { AerisTableModule, type AerisTableColumn, type AerisTableData } from '@aeris-ui/core/table';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import { AerisTextarea } from '@aeris-ui/core/textarea';
import { AerisTimelineModule, type AerisTimelineItem } from '@aeris-ui/core/timeline';
import { AerisToggleSwitch } from '@aeris-ui/core/toggle-switch';
import { AerisToolbarModule } from '@aeris-ui/core/toolbar';
import { AerisTooltip } from '@aeris-ui/core/tooltip';
import { LucideDynamicIcon } from '@lucide/angular';

import { DOC_ICONS } from '../documentation/doc-icons';

type ShowcaseSection = 'overview' | 'projects' | 'team' | 'quality' | 'profile';

interface ShowcaseFeedback {
  readonly severity: AerisMessageSeverity;
  readonly text: string;
}

interface ShowcaseProject {
  readonly name: string;
  readonly description: string;
  readonly progress: number;
  readonly status: string;
  readonly severity: 'success' | 'info' | 'warning';
  readonly team: readonly string[];
}

const SECTION_COPY: Readonly<
  Record<ShowcaseSection, { readonly title: string; readonly description: string }>
> = {
  overview: {
    title: 'Overview',
    description: 'A clear view of delivery, people, and the work needing attention.',
  },
  projects: {
    title: 'Projects',
    description: 'Follow initiatives from discovery through release without losing context.',
  },
  team: {
    title: 'Team',
    description: 'Balance capacity, coordinate reviews, and keep decisions visible.',
  },
  quality: {
    title: 'Quality',
    description: 'Track accessibility, browser coverage, and release confidence together.',
  },
  profile: {
    title: 'Profile',
    description: 'Keep your identity, role, and workspace preferences up to date.',
  },
};

@Component({
  selector: 'app-aeris-application-showcase',
  imports: [
    AerisAccordionModule,
    AerisAvatarModule,
    AerisBadgeModule,
    AerisButton,
    AerisCardModule,
    AerisChartModule,
    AerisCheckbox,
    AerisChipModule,
    AerisDatePicker,
    AerisDialogModule,
    AerisDivider,
    AerisFileUploadModule,
    AerisIconField,
    AerisInputNumber,
    AerisInputText,
    AerisMessageModule,
    AerisMeterGroupModule,
    AerisMultiSelect,
    AerisPanelModule,
    AerisProgressBarModule,
    AerisRadioButton,
    AerisRating,
    AerisSelect,
    AerisSkeleton,
    AerisSlider,
    AerisTableModule,
    AerisTabsModule,
    AerisTextarea,
    AerisTimelineModule,
    AerisToggleSwitch,
    AerisToolbarModule,
    AerisTooltip,
    LucideDynamicIcon,
  ],
  templateUrl: './aeris-application-showcase.component.html',
  styleUrls: [
    './aeris-application-showcase.component.scss',
    './aeris-application-showcase-profile.scss',
    './aeris-application-showcase-responsive.scss',
  ],
  host: {
    '[attr.data-compact]': 'compact() || null',
  },
})
export class AerisApplicationShowcaseComponent {
  readonly compact = input(false);

  protected readonly icons = DOC_ICONS;
  protected readonly activeSection = signal<ShowcaseSection>('overview');
  protected readonly sectionCopy = computed(() => SECTION_COPY[this.activeSection()]);
  protected readonly activeView = signal('insights');
  protected readonly selectedTeam = signal<string | null>('design');
  protected readonly visibility = signal<string | null>('team');
  protected readonly notifications = signal(true);
  protected readonly includeResearch = signal(true);
  protected readonly capacity = signal(68);
  protected readonly satisfaction = signal(4);
  protected readonly selectedMembers = signal<readonly string[]>(['maya']);
  protected readonly memberFilter = signal('');
  protected readonly workspaceSearch = signal('');
  protected readonly visibleProjects = computed(() => {
    const query = this.workspaceSearch().trim().toLowerCase();
    if (!query) return this.projects;
    return this.projects.filter((project) =>
      [project.name, project.description, project.status].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  });
  protected readonly searchSummary = computed(() => {
    const query = this.workspaceSearch().trim().toLowerCase();
    if (!query) return '';
    const projectMatches = this.visibleProjects().length;
    const memberMatches = this.members.filter((member) =>
      Object.values(member).some((value) => String(value).toLowerCase().includes(query)),
    ).length;
    return `${projectMatches} project${projectMatches === 1 ? '' : 's'} and ${memberMatches} team member${memberMatches === 1 ? '' : 's'} match “${this.workspaceSearch().trim()}”.`;
  });
  protected readonly dialogOpen = signal(false);
  protected readonly helpVisible = signal(false);
  protected readonly feedback = signal<ShowcaseFeedback | null>(null);
  protected readonly projectCount = signal(12);
  protected readonly selectedProject = signal('Northstar mobile');
  protected readonly workspaceName = signal('Northstar');
  protected readonly reviewDate = signal<AerisDatePickerValue>(new Date(2026, 6, 22));
  protected readonly weeklyTarget = signal<number | null>(32);
  protected readonly reviewers = signal<readonly string[]>(['design', 'engineering']);
  protected readonly digestEnabled = signal(true);
  protected readonly approvalsRequired = signal(false);
  protected readonly profileName = signal('Maya Chen');
  protected readonly profileEmail = signal('maya@northstar.dev');
  protected readonly profileRole = signal<string | null>('admin');
  protected readonly profileBio = signal(
    'Product systems lead focused on accessible workflows and resilient design foundations.',
  );
  protected readonly profileImage = signal('');

  protected readonly teamOptions: readonly AerisSelectOption[] = [
    { label: 'Design system', value: 'design' },
    { label: 'Product engineering', value: 'engineering' },
    { label: 'Research', value: 'research' },
  ];

  protected readonly reviewerOptions: readonly AerisSelectOption[] = [
    { label: 'Design', value: 'design' },
    { label: 'Engineering', value: 'engineering' },
    { label: 'Research', value: 'research' },
    { label: 'Quality assurance', value: 'quality' },
  ];

  protected readonly profileRoleOptions: readonly AerisSelectOption[] = [
    { label: 'Administrator', value: 'admin' },
    { label: 'Product lead', value: 'product' },
    { label: 'Contributor', value: 'contributor' },
  ];

  protected readonly memberColumns: readonly AerisTableColumn[] = [
    { field: 'name', header: 'Member', sortable: true, width: '34%' },
    { field: 'role', header: 'Role', width: '30%' },
    { field: 'status', header: 'Status', sortable: true, width: '18%' },
    { field: 'workload', header: 'Load', align: 'end', width: '18%' },
  ];

  protected readonly members: readonly AerisTableData[] = [
    { id: 'maya', name: 'Maya Chen', role: 'Product designer', status: 'Active', workload: '72%' },
    {
      id: 'noah',
      name: 'Noah Williams',
      role: 'Angular engineer',
      status: 'Active',
      workload: '64%',
    },
    { id: 'sofia', name: 'Sofia Rossi', role: 'Researcher', status: 'Review', workload: '51%' },
    { id: 'liam', name: 'Liam Novak', role: 'QA engineer', status: 'Active', workload: '43%' },
  ];

  protected readonly projects: readonly ShowcaseProject[] = [
    {
      name: 'Northstar mobile',
      description: 'Responsive workspace and field workflows for distributed teams.',
      progress: 78,
      status: 'On track',
      severity: 'success',
      team: ['MC', 'NW', 'SR'],
    },
    {
      name: 'Atlas analytics',
      description: 'A clearer reporting experience for product and operations leaders.',
      progress: 56,
      status: 'In review',
      severity: 'info',
      team: ['LN', 'MC'],
    },
    {
      name: 'Relay onboarding',
      description: 'Guided account setup with accessible validation and recovery paths.',
      progress: 34,
      status: 'At risk',
      severity: 'warning',
      team: ['SR', 'NW', 'LN'],
    },
  ];

  protected readonly allocation: readonly AerisMeterGroupItem[] = [
    { label: 'Build', value: 42, tone: 'primary' },
    { label: 'Review', value: 24, tone: 'info' },
    { label: 'Research', value: 18, tone: 'success' },
  ];

  protected readonly activity: readonly AerisTimelineItem[] = [
    {
      id: 'tokens',
      title: 'Theme tokens approved',
      description: 'The accessibility review passed for both color schemes.',
      date: '09:42',
      status: 'success',
    },
    {
      id: 'table',
      title: 'Table patterns updated',
      description: 'Responsive and editable states are ready for review.',
      date: '11:18',
      status: 'info',
    },
    {
      id: 'release',
      title: 'Alpha review scheduled',
      description: 'Final browser checks begin tomorrow morning.',
      date: '14:00',
      status: 'warning',
    },
  ];

  protected readonly deliveryData: AerisChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      { label: 'Completed', data: [18, 24, 21, 31, 35, 42], tension: 0.35, fill: true },
      { label: 'Planned', data: [20, 23, 26, 29, 34, 38], tension: 0.35 },
    ],
  };

  protected readonly portfolioData: AerisChartData = {
    labels: ['Discovery', 'Design', 'Build', 'Review'],
    datasets: [{ label: 'Active work', data: [4, 7, 11, 5], borderRadius: 6 }],
  };

  protected readonly qualityData: AerisChartData = {
    labels: ['A11y', 'Browsers', 'Tests', 'Performance', 'Docs'],
    datasets: [
      { label: 'Current', data: [96, 91, 94, 86, 89] },
      { label: 'Target', data: [98, 95, 96, 92, 94] },
    ],
  };

  protected readonly chartOptions: AerisChartOptions = {
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: { position: 'bottom' } },
  };

  protected readonly radialOptions: AerisChartOptions = {
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
  };

  protected openSection(section: ShowcaseSection): void {
    this.activeSection.set(section);
    this.feedback.set(null);
  }

  protected searchWorkspace(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.workspaceSearch.set(value);
    this.memberFilter.set(value);
  }

  protected toggleHelp(): void {
    this.helpVisible.update((visible) => !visible);
  }

  protected saveDraft(): void {
    this.notify('Cycle draft saved. Your team can continue editing it.', 'info');
  }

  protected scheduleCycle(event: Event): void {
    event.preventDefault();
    this.notify('The next cycle is scheduled and reviewers were notified.', 'success');
  }

  protected openProject(name: string): void {
    this.selectedProject.set(name);
    this.notify(`${name} is now the active project.`, 'info');
  }

  protected inviteMember(): void {
    this.notify('A secure invitation link was copied for the team.', 'success');
  }

  protected sendCheckIn(): void {
    this.notify('A capacity check-in was sent to the selected team members.', 'success');
  }

  protected runAudit(): void {
    this.notify('Quality audit completed: 24 checks passed and 2 need review.', 'success');
  }

  protected exportReport(): void {
    this.notify('The release quality report is ready to download.', 'info');
  }

  protected savePreferences(event: Event): void {
    event.preventDefault();
    this.notify('Workspace preferences saved.', 'success');
  }

  protected restorePreferences(): void {
    this.workspaceName.set('Northstar');
    this.reviewDate.set(new Date(2026, 6, 22));
    this.weeklyTarget.set(32);
    this.reviewers.set(['design', 'engineering']);
    this.digestEnabled.set(true);
    this.approvalsRequired.set(false);
    this.notify('Workspace preferences restored.', 'info');
  }

  protected createProject(): void {
    this.projectCount.update((count) => count + 1);
    this.dialogOpen.set(false);
    this.activeSection.set('projects');
    this.notify('New initiative created and added to the project portfolio.', 'success');
  }

  protected updateProfileImage(event: AerisFileUploadSelectEvent): void {
    const file = event.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') this.profileImage.set(reader.result);
    });
    reader.readAsDataURL(file);
  }

  protected removeProfileImage(): void {
    this.profileImage.set('');
    this.notify('Profile image removed.', 'info');
  }

  protected saveProfile(event: Event): void {
    event.preventDefault();
    this.notify('Profile changes saved.', 'success');
  }

  protected notify(text: string, severity: AerisMessageSeverity): void {
    this.feedback.set({ text, severity });
  }
}
