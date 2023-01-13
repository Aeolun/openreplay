import React from 'react';
import { Icon, PageTitle, Button, Link, SegmentSelection } from 'UI';
import MetricsSearch from '../MetricsSearch';
import Select from 'Shared/Select';
import { useStore } from 'App/mstore';
import { observer, useObserver } from 'mobx-react-lite';
import { DROPDOWN_OPTIONS, Option } from 'App/constants/card';

function MetricViewHeader() {
  const { metricStore } = useStore();
  const sort = metricStore.sort;
  const listView = metricStore.listView;
  const filter = metricStore.filter;

  const writeOption = (e: any, { name, value }: any) => {};

  return (
    <div>
      <div className="flex items-center mb-4 justify-between px-6">
        <div className="flex items-baseline mr-3">
          <PageTitle title="Cards" className="" />
        </div>
        <div className="ml-auto flex items-center">
          <Link to={'/metrics/create'}>
            <Button variant="primary">New Card</Button>
          </Link>
          {/* <SegmentSelection
            name="viewType"
            className="mx-3"
            primary
            onSelect={() => metricStore.updateKey('listView', !listView)}
            value={{ value: listView ? 'list' : 'grid' }}
            list={[
              { value: 'list', name: '', icon: 'graph-up-arrow' },
              { value: 'grid', name: '', icon: 'hash' },
            ]}
          />
          <div className="mx-2">
            <Select
              options={[
                { label: 'Newest', value: 'desc' },
                { label: 'Oldest', value: 'asc' },
              ]}
              defaultValue={sort.by}
              plain
              onChange={({ value }) => metricStore.updateKey('sort', { by: value.value })}
            />
          </div> */}
          <div className="ml-4 w-1/4" style={{ minWidth: 300 }}>
            <MetricsSearch />
          </div>
        </div>
      </div>
      <div className="text-base text-disabled-text flex items-center px-6">
        <Icon name="info-circle-fill" className="mr-2" size={16} />
        Create custom Cards to capture key interactions and track KPIs.
      </div>
      <div className="border-y px-3 py-1 mt-2 flex items-center w-full justify-between">
        <ListViewToggler />

        <div className="items-center flex gap-4">
          <Select
            options={[{ label: 'All Types', value: 'all' }, ...DROPDOWN_OPTIONS]}
            name="type"
            defaultValue={filter.type}
            onChange={({ value }) => metricStore.updateKey('filter', { ...filter, type: value.value})}
            plain={true}
          />

          <Select
            options={[
              { label: 'Newest', value: 'desc' },
              { label: 'Oldest', value: 'asc' },
            ]}
            name="sort"
            defaultValue={metricStore.sort.by}
            onChange={({ value }) => metricStore.updateKey('sort', { by: value.value })}
            plain={true}
          />

          <DashboardDropdown
            plain={true}
            onChange={(value: any) => metricStore.updateKey('filter', { ...filter, dashboard: value})}
          />
        </div>
      </div>
    </div>
  );
}

export default observer(MetricViewHeader);

function DashboardDropdown({ onChange, plain = false }: { plain?: boolean; onChange: any }) {
  const { dashboardStore, metricStore } = useStore();
  const dashboardOptions = dashboardStore.dashboards.map((i: any) => ({
    key: i.id,
    label: i.name,
    value: i.dashboardId,
  }));

  return (
    <Select
      isSearchable={true}
      placeholder="Select Dashboard"
      plain={plain}
      options={dashboardOptions}
      value={metricStore.filter.dashboard}
      onChange={({ value }: any) => onChange(value)}
      isMulti={true}
    />
  );
}

function ListViewToggler({}) {
  const { metricStore } = useStore();
  const listView = useObserver(() => metricStore.listView);
  return (
    <div className="flex items-center">
      <Button
        icon="list-alt"
        variant={listView ? 'text-primary' : 'text'}
        onClick={() => metricStore.updateKey('listView', true)}
      >
        List
      </Button>
      <Button
        icon="grid"
        variant={!listView ? 'text-primary' : 'text'}
        onClick={() => metricStore.updateKey('listView', false)}
      >
        Grid
      </Button>
    </div>
  );
}
