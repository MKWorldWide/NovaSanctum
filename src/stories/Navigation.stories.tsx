import type { Meta, StoryObj } from '@storybook/react';
import Navigation from '../components/Navigation';

const meta: Meta<typeof Navigation> = {
  title: 'Components/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Navigation>;

export const Default: Story = {
  args: {},
};

export const WithSelectedTrajectory: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = canvasElement as HTMLElement;
    const marsTrajectory = canvas.querySelector('div:nth-child(1)') as HTMLDivElement;
    if (marsTrajectory) {
      marsTrajectory.click();
    }
  },
};

export const WithCourseCorrection: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = canvasElement as HTMLElement;
    const correctionButton = canvas.querySelector('button') as HTMLButtonElement;
    if (correctionButton) {
      correctionButton.click();
    }
  },
};
