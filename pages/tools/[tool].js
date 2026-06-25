import Layout from '../../components/Layout';
import ToolPage from '../../components/ToolPage';
import { buildExampleVerdicts } from '../../lib/catalog';
import { getDatasetOptions, getDatasetStats } from '../../lib/data';
import { getToolConfig, TOOL_SLUGS } from '../../lib/tools';

export default function ToolRoute({ config, options, datasetStats, exampleVerdicts }) {
  return (
    <ToolPage
      config={config}
      options={options}
      datasetStats={datasetStats}
      exampleVerdicts={exampleVerdicts}
    />
  );
}

ToolRoute.getLayout = function getLayout(page) {
  const { config } = page.props;
  return (
    <Layout
      breadcrumbs={[
        { href: '/', label: 'Home' },
        { href: '/tools', label: 'Tools' },
        { href: `/tools/${config.slug}`, label: config.h1 },
      ]}
    >
      {page}
    </Layout>
  );
};

export async function getStaticPaths() {
  return {
    paths: TOOL_SLUGS.map(tool => ({ params: { tool } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const config = getToolConfig(params.tool);
  const all = getDatasetOptions();
  const options = config.kindFilter ? all.filter(item => item.kind === config.kindFilter) : all;
  return {
    props: {
      config,
      options,
      datasetStats: getDatasetStats(),
      exampleVerdicts: buildExampleVerdicts(options),
    },
  };
}
