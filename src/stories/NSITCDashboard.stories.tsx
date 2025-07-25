import type { Meta, StoryObj } from '@storybook/react';
import NSITCDashboard from '../components/NSITCDashboard';

const meta: Meta<typeof NSITCDashboard> = {
  title: 'Components/NS-ITC Dashboard',
  component: NSITCDashboard,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NSITCDashboard>;

export const Default: Story = {
  args: {},
};

export const WithNavigationActive: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = canvasElement as HTMLElement;
    const navigationButton = canvas.querySelector('button:nth-child(2)') as HTMLButtonElement;
    if (navigationButton) {
      navigationButton.click();
    }
  },
};

export const WithDefenseActive: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = canvasElement as HTMLElement;
    const defenseButton = canvas.querySelector('button:nth-child(3)') as HTMLButtonElement;
    if (defenseButton) {
      defenseButton.click();
    }
  },
};

export const WithAIActive: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = canvasElement as HTMLElement;
    const aiButton = canvas.querySelector('button:nth-child(4)') as HTMLButtonElement;
    if (aiButton) {
      aiButton.click();
    }
  },
};
